import { PrismaClient } from "@prisma/client";
import { ICreateUser } from "../interfaces/user/interface.user";

const prisma = new PrismaClient();

export const findUsers = async (
  skip: number,
  limit: number,
  sort: number
): Promise<[any[], number]> => {
  const users = await prisma.users.findMany({
    skip,
    take: limit,
    orderBy: {
      createdAt: sort === 1 ? "asc" : "desc",
    },
  });

  const total: number = await prisma.users.count();
  return [users, total];
};

export const findUserById = async (id: number) => {
  return await prisma.users.findUnique({
    where: {
      id: id,
    },
  });
};

export const findUserByModel = async (model: string) => {
  return await prisma.users.findUnique({
    where: {
      model: model,
    },
  });
};

export const createUser = async (body: ICreateUser) => {
  return await prisma.users.create({
    data: body,
  });
};

export const updateUserById = async (body: ICreateUser) => {
  return await prisma.users.update({
    where: {
      model: body.model,
    },
    data: body,
  });
};

export const deleteUserById = async (id: number) => {
  return await prisma.users.delete({
    where: {
      id: id,
    },
  });
};
