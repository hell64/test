"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

// Get user ID from cookies
async function getUserId() {
  const userId = (await cookies()).get("user_id")?.value;
  if (!userId) {
    throw new Error("User not authenticated");
  }
  return Number(userId);
}

// Get all categories
export async function getCategories(type?: string) {
  try {
    const userId = await getUserId();

    // Build where clause
    // const where: any = { user_id: userId };

    // if (type) {
    //   where.type = type;
    // }

    // Get categories
    const categories = await prisma.category.findMany({
      // where,
      orderBy: { name: "asc" },
    });

    return {
      success: true,
      data: categories,
    };
  } catch (error) {
    console.error("Get categories error:", error);
    return { success: false, message: "Failed to fetch categories" };
  }
}

// Create category
export async function createCategory(formData: FormData) {
  try {
    const userId = await getUserId();
    const name = formData.get("name") as string;
    // const type = formData.get("type") as string;
    // const color = formData.get("color") as string;
    // const icon = formData.get("icon") as string;

    // Validate input
    if (!name) {
      return { success: false, message: "Назва є обов'язковою" };
    }

    // Check if category already exists
    const existingCategory = await prisma.category.findFirst({
      where: {
        name,
        user_id: userId,
      },
    });

    if (existingCategory) {
      return {
        success: false,
        message: "Категорія з такою назвою вже існує",
      };
    }

    // Create category
    await prisma.category.create({
      data: {
        name,
        // type,
        // color,
        // icon,
        user_id: userId,
      },
    });

    // revalidatePath("/transactions");
    // revalidatePath("/budgets");
    revalidatePath("/categories");

    return { success: true, message: "Category created successfully" };
  } catch (error) {
    console.error("Create category error:", error);
    return { success: false, message: "Failed to create category" };
  }
}

// Update category
export async function updateCategory(id: number, formData: FormData) {
  try {
    const userId = getUserId();
    const name = formData.get("name") as string;
    // const color = formData.get("color") as string;
    // const icon = formData.get("icon") as string;

    // Validate input
    if (!name) {
      return { success: false, message: "Назва є обов'язковою" };
    }

    // Check if category exists and belongs to user
    const existingCategory = await prisma.category.findFirst({
      where: {
        id,
        user_id: userId,
      },
    });

    if (!existingCategory) {
      return { success: false, message: "Категорія не знайдена" };
    }

    // Check if category is default
    if (existingCategory.is_default) {
      return {
        success: false,
        message: "Типові категорії не можна змінювати",
      };
    }

    // Check if name already exists for another category
    const duplicateCategory = await prisma.category.findFirst({
      where: {
        name,
        user_id: userId,
        id: { not: id },
      },
    });

    if (duplicateCategory) {
      return {
        success: false,
        message: "Категорія з такою назвою вже існує",
      };
    }

    // Update category
    await prisma.category.update({
      where: { id },
      data: {
        name,
        // color,
        // icon,
      },
    });

    // revalidatePath("/transactions");
    revalidatePath("/categories");

    return { success: true, message: "Категорія оновлена успішно" };
  } catch (error) {
    console.error("Update category error:", error);
    return { success: false, message: "Не вдалося оновити категорію" };
  }
}

// Delete category
export async function deleteCategory(id: number) {
  try {
    const userId = getUserId();

    // Check if category exists and belongs to user
    // const existingCategory = await prisma.category.findFirst({
    //   where: {
    //     id,
    //     user_id: userId,
    //   },
    // });

    // if (!existingCategory) {
    //   return { success: false, message: "Category not found" };
    // }

    // Check if category is default
    // if (existingCategory.is_default) {
    //   return {
    //     success: false,
    //     message: "Default categories cannot be deleted",
    //   };
    // }

    // Check if category is used in transactions
    // const transactionCount = await prisma.transaction.count({
    //   where: {
    //     category_id: id,
    //   },
    // });

    // if (transactionCount > 0) {
    //   return {
    //     success: false,
    //     message: "This category is used in transactions and cannot be deleted",
    //   };
    // }

    // Check if category is used in budgets
    // const budgetCount = await prisma.budget.count({
    //   where: {
    //     category_id: id,
    //   },
    // });

    // if (budgetCount > 0) {
    //   return {
    //     success: false,
    //     message: "This category is used in budgets and cannot be deleted",
    //   };
    // }

    // Delete category
    await prisma.category.delete({
      where: { id },
    });

    revalidatePath("/categories");

    return { success: true, message: "Категорія видалена успішно" };
  } catch (error) {
    console.error("Delete category error:", error);
    return { success: false, message: "Не вдалося видалити категорію" };
  }
}
