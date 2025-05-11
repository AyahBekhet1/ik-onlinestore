"use server";
import { prisma } from "@/db/prisma";
import { convertToPlainObj, formateError } from "../utils";
import { LATEST_PRODUCT_LIMIT, PAGE_SIZE } from "../constants";
import { revalidatePath } from "next/cache";
import { insertProductSchema, updateProductSchema } from "../validators";
import { z } from "zod";
import { Prisma } from "@prisma/client";

//get latest products
export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCT_LIMIT,
    orderBy: { createdAt: "desc" },
  });
  return convertToPlainObj(data);
}

//get single product by it's Slug

export async function getProductBySlug(slug: string) {
  return await prisma.product.findFirst({
    where: {
      slug: slug,
    },
  });
}

//get products by its category name
export async function getProductsByCategory (categoryName:string){
  const data=await prisma.product.findMany({
    where:{category:categoryName}
  })
  return convertToPlainObj(data)
}
//get single product by it's Id

export async function getProductById(productId: string) {
  const data = await prisma.product.findFirst({
    where: {
      id: productId,
    },
  });

  return convertToPlainObj(data);
}

//get all products

export async function getAllProducts({
  query,
  limit = PAGE_SIZE,
  page,
  category,
  price,
  rating,
  sort,
}: {
  query?: string;
  limit?: number;
  page: number;
  category?: string;
  price?: string;
  rating?: string;
  sort?: string;
}) {
  // Query filter
  const queryFilter: Prisma.ProductWhereInput =
    query && query !== "all"
      ? {
          name: {
            contains: query,
            mode: "insensitive",
          } as Prisma.StringFilter,
        }
      : {};

  // Category filter
  const categoryFilter = category && category !== "all" ? { category } : {};

  // Price filter
  const priceFilter: Prisma.ProductWhereInput =
    price && price !== "all"
      ? {
          price: {
            gte: Number(price.split("-")[0]),
            lte: Number(price.split("-")[1]),
          },
        }
      : {};

  // Rating filter
  const ratingFilter =
    rating && rating !== "all"
      ? {
          rating: {
            gte: Number(rating),
          },
        }
      : {};

  const data = await prisma.product.findMany({
    where: {
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    },
    orderBy:
      sort === "lowest"
        ? { price: "asc" }
        : sort === "highest"
        ? { price: "desc" }
        : sort === "rating"
        ? { rating: "desc" }
        : { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  const dataCount = await prisma.product.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

//delete product

export async function deleteProduct(id: string) {
  try {
    const productExist = await prisma.product.findFirst({
      where: { id },
    });

    if (!productExist) throw new Error("product not found");

    await prisma.product.delete({
      where: { id },
    });

    revalidatePath("/admin/products");
    return { success: true, message: "product deleted successfully" };
  } catch (error) {
    return { success: false, message: formateError(error) };
  }
}

//craete product
export async function createProduct(data: z.infer<typeof insertProductSchema>) {
  try {
    const product = insertProductSchema.parse(data);

    await prisma.product.create({
      data: product,
    });

    revalidatePath("/admin/products");
    return { success: true, message: "product created successfully" };
  } catch (error) {
    return { success: false, message: formateError(error) };
  }
}

//update product
export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
  try {
    const product = updateProductSchema.parse(data);

    const productExist = await prisma.product.findFirst({
      where: { id: product.id },
    });

    if (!productExist) throw new Error("Product not found");

    await prisma.product.update({
      where: { id: product.id },
      data: product,
    });

    revalidatePath("/admin/products");
    return { success: true, message: "product updated successfully" };
  } catch (error) {
    return { success: false, message: formateError(error) };
  }
}

export async function getAllCategories() {
  const data = await prisma.product.groupBy({
    by:['category'],
    _count:true
  })

  return data;
}