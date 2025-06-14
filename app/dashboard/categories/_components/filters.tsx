"use client";

import { CalendarIcon, Filter } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useQueryState } from "nuqs";
import { uk } from "date-fns/locale";

export function CategoriesFilters() {
  const [category, setCategory] = useQueryState("category", {
    defaultValue: "",
  });
  const [date, setDate] = useQueryState("date", { defaultValue: "" });
  const [type, setType] = useQueryState("type", { defaultValue: "" });

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Всі категорії" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Всі категорії</SelectItem>
          <SelectItem value="food">Їжа</SelectItem>
          <SelectItem value="transportation">Транспорт</SelectItem>
          <SelectItem value="utilities">Комунальні послуги</SelectItem>
          <SelectItem value="entertainment">Розваги</SelectItem>
          <SelectItem value="shopping">Покупки</SelectItem>
          <SelectItem value="income">Доходи</SelectItem>
        </SelectContent>
      </Select>
      <Select value={type} onValueChange={setType}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Всі типи" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Всі типи</SelectItem>
          <SelectItem value="income">Доходи</SelectItem>
          <SelectItem value="expense">Витрати</SelectItem>
        </SelectContent>
      </Select>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : "Виберіть дату"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            locale={uk}
            selected={date ? new Date(date) : undefined}
            onSelect={(date) => setDate(date?.toISOString() || "")}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {/* <Button
        variant="outline"
        size="icon"
        onClick={() => {
          setCategory("");
          setDate("");
          setType("");
        }}
      >
        <Filter className="h-4 w-4" />
        <span className="sr-only">Фільтр</span>
      </Button> */}
      <Button
        variant="ghost"
        className="ml-auto"
        onClick={() => {
          setCategory("");
          setDate("");
          setType("");
        }}
      >
        Очистити фільтри
      </Button>
    </div>
  );
}
