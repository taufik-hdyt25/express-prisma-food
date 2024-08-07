import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import { Request, Response } from "express";
import { deleteImageCloudinary } from "../helper/deleteImageCloudinary";
import { ICreateUser } from "../interfaces/user/interface.user";
import { upload, uploadToCloudinary } from "../middlewares/uploadCloudinary";
import {
  deleteFoodById,
  findFoodById,
  updateFood,
} from "../services/food.services";
import {
  createUser,
  findUserById,
  findUserByModel,
  findUsers,
  updateUserById,
} from "../services/user.services";

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // Extract query parameters
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const sort = req.query.sort === "asc" ? 1 : -1; // Default to descending
    // Calculate the offset
    const skip = (page - 1) * limit;

    // Fetch categories with pagination and sorting
    const [foods, total] = await findUsers(skip, limit, sort);

    // Calculate total pages
    const totalPages = Math.ceil(total / limit);

    // Determine next and previous pages
    const nextPage = page < totalPages ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    return res.status(200).json({
      data: foods,
      page,
      totalPages,
      total,
      nextPage,
      prevPage,
      message: "Success get data",
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const user = await findUserById(id);

    if (user) {
      return res.status(200).json({
        user: user,
        message: "Success get user",
      });
    } else {
      return res.status(404).json({ message: "User empty" });
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const postUser = async (req: Request, res: Response) => {
  try {
    const body: ICreateUser = req.body;

    const userByModel = await findUserByModel(body.model);

    if (userByModel) {
      return res.status(400).json({
        message: "Device is ready",
      });
    }

    const user = await createUser(body);
    return res.status(201).json({
      user: user,
      message: "Success Add User",
    });
  } catch (error) {
    if (error instanceof PrismaClientValidationError) {
      return res.status(400).json({ error_createFood: error.message });
    } else {
      return res
        .status(500)
        .json({ error_createFood: "An unexpected error occurred." });
    }
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const user = await findUserById(id);
    if (!user)
      return res.status(404).json({
        message: "User not found",
      });

    await deleteFoodById(id);

    return res.status(200).json({
      message: "Delete user success",
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const body: ICreateUser = req.body;
    const user = await findUserByModel(body.model);
    if (!user)
      return res.status(404).json({
        message: "User not found",
      });

    const update = await updateUserById(body);

    return res.status(200).json({
      user: update,
      message: "Update user success",
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
