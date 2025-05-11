"use server";

import { prisma } from "@/db/prisma";
import { insertCategorySchema, updateCategorySchema } from "../validators";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { convertToPlainObj, formateError } from "../utils";
import { PAGE_SIZE } from "../constants";


//Get All categories
export async function getAllCategory({
  limit = PAGE_SIZE,
  page = 1,
}: {
  limit?: number;
  page?: number;
}={}) {
  const safeLimit = Math.max(limit ?? PAGE_SIZE, 1);
  const safePage = Math.max(page ?? 1, 1);
  const skip = (safePage - 1) * safeLimit;

  const data = await prisma.category.findMany({
    skip,
    take: safeLimit,
  });

  const dataCount = await prisma.category.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / safeLimit),
  };
}

//update category
export async function updateCategory(data: z.infer<typeof updateCategorySchema>) {
  try {
    const category = updateCategorySchema.parse(data);

    const categoryExist = await prisma.category.findFirst({
      where: { id: category.id },
    });

    if (!categoryExist) throw new Error("Category not found");

    await prisma.category.update({
      where: { id: category.id },
      data: category,
    });

    revalidatePath("/admin/categories");
    return { success: true, message: "category updated successfully" };
  } catch (error) {
    return { success: false, message: formateError(error) };
  }
}


//get single category by it's Slug
export async function getCategoryBySlug(slug: string) {
  return await prisma.category.findFirst({
    where: {
      slug: slug,
    },
  });
}


//delete cayegory
export async function deleteCategory(id: string) {
  try {
    const categoryExist = await prisma.category.findFirst({
      where: { id },
    });

    if (!categoryExist) throw new Error("category not found");

    await prisma.category.delete({
      where: { id },
    });

    revalidatePath("/admin/categories");
    return { success: true, message: "category deleted successfully" };
  } catch (error) {
    return { success: false, message: formateError(error) };
  }
}


//craete category
export async function createCategory(data: z.infer<typeof insertCategorySchema>) {
  try {
    const category = insertCategorySchema.parse(data);

    await prisma.category.create({
      data: category,
    });

    revalidatePath("/admin/categories");
    return { success: true, message: "category created successfully" };
  } catch (error) {
    return { success: false, message: formateError(error) };
  }
}


//get single category by it's Id

export async function getCategoryById(categoryId: string) {
  const data = await prisma.category.findFirst({
    where: {
      id: categoryId,
    },
  });

  return convertToPlainObj(data);
}