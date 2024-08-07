import { PrismaClient } from "@prisma/client";
import {
  ICategory,
  ICreateCategory,
} from "../interfaces/category/interface.category";

const prisma = new PrismaClient();

export const getCategories = async (
  skip: number,
  limit: number,
  sort: number
): Promise<[any[], number]> => {
  const categories = await prisma.categories.findMany({
    skip,
    take: limit,
    orderBy: {
      createdAt: sort === 1 ? "asc" : "desc",
    },
  });

  const total: number = await prisma.categories.count();

  return [categories, total];
};

export const getCategoryById = async (
  id: number
): Promise<ICategory | null> => {
  return await prisma.categories.findUnique({
    where: {
      id: id,
    },
  });
};

export const createCategory = async (body: ICreateCategory) => {
  return await prisma.categories.create({
    data: body,
  });
};

export const deleteCategory = async (id: number) => {
  return await prisma.categories.delete({
    where: {
      id: id,
    },
  });
};
