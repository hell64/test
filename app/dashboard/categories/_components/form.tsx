"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  createTransaction,
  updateTransaction,
} from "@/app/actions/transaction";
import { getCategories } from "@/app/actions/category";
import { uk } from "date-fns/locale";

interface TransactionFormProps {
  transaction?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CategoriesForm({
  transaction,
  onSuccess,
  onCancel,
}: TransactionFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState<Date>(
    transaction ? new Date(transaction.date) : new Date()
  );
  const [categories, setCategories] = useState<any[]>([]);
  const [type, setType] = useState(transaction?.type || "expense");

  useEffect(() => {
    async function fetchCategories() {
      try {
        const result = await getCategories();
        if (result.success) {
          setCategories(result.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }

    fetchCategories();
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      formData.set("date", date.toISOString());

      let result;

      if (transaction) {
        result = await updateTransaction(transaction.id, formData);
      } else {
        result = await createTransaction(formData);
      }

      if (result.success) {
        toast({
          title: "Успіх",
          description: result.message,
        });

        if (onSuccess) {
          onSuccess();
        } else {
          router.push("/transactions");
          router.refresh();
        }
      } else {
        toast({
          title: "Помилка",
          description: result.message,
          variant: "destructive",
        });
        setIsLoading(false);
      }
    } catch (error) {
      toast({
        title: "Помилка",
        description: "Сталася помилка",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {transaction ? "Редагувати транзакцію" : "Додати транзакцію"}
        </CardTitle>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Тип</Label>
            <Select
              name="type"
              defaultValue={type}
              onValueChange={setType}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Дохід</SelectItem>
                <SelectItem value="expense">Витрата</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Сума</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              defaultValue={transaction?.amount || ""}
              placeholder="0.00"
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Опис</Label>
            <Input
              id="description"
              name="description"
              defaultValue={transaction?.description || ""}
              placeholder="e.g., Grocery shopping"
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category_id">Категорія</Label>
            <Select
              name="category_id"
              defaultValue={transaction?.category_id?.toString() || ""}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories
                  .filter((category) => category.type === type)
                  .map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Дата</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                  disabled={isLoading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Виберіть дату"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  locale={uk}
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Опис (Не обов'язково)</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={transaction?.description || ""}
              placeholder="Додайте будь-які додаткові деталі..."
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel || (() => router.back())}
            disabled={isLoading}
          >
            Скасувати
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {transaction ? "Оновити" : "Створити"} Транзакцію
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
