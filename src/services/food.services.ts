import { PrismaClient } from "@prisma/client";
import { ICreateFood, IUpdateFood } from "../interfaces/food/interface.food";

const prisma = new PrismaClient();

export const findFoods = async (
  skip: number,
  limit: number,
  sort: number
): Promise<[any[], number]> => {
  const foods = await prisma.foods.findMany({
    skip,
    take: limit,
    orderBy: {
      createdAt: sort === 1 ? "asc" : "desc",
    },
    include: {
      category: true, // Include the related category
    },
  });

  const total: number = await prisma.foods.count();

  return [foods, total];
};

export const findFoodById = async (id: number) => {
  return await prisma.foods.findUnique({
    where: {
      id: id,
    },
  });
};

export const createFood = async (body: ICreateFood) => {
  return await prisma.foods.create({
    data: body,
  });
};

export const updateFood = async (body: IUpdateFood) => {
  return await prisma.foods.update({
    where: {
      id: body.id,
    },
    data: {
      categoryId: body.categoryId,
      image: body.image,
      name: body.name,
      ingredients: body.ingredients,
      steps: body.steps,
      description: body.description,
    },
  });
};

export const deleteFoodById = async (id: number) => {
  return await prisma.foods.delete({
    where: {
      id: id,
    },
  });
};
