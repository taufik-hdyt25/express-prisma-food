import { Request, Response } from "express";
import { upload, uploadToCloudinary } from "../middlewares/uploadCloudinary";
import {
  createFood,
  deleteFoodById,
  findFoodById,
  findFoods,
  updateFood,
} from "../services/food.services";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import { ICreateFood } from "../interfaces/food/interface.food";
import { validateFood } from "../validator/food.validator";
import { validationResult } from "express-validator";
import cloudinary from "../utils/cloudinaryConfig";
import { deleteImageCloudinary } from "../helpers/deleteImageCloudinary";

export const getAllFoods = async (
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
    const [foods, total] = await findFoods(skip, limit, sort);

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

export const getFoodById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const food = await findFoodById(id);

    if (food) {
      return res.status(200).json({
        food: food,
        message: "Success get food",
      });
    } else {
      return res.status(404).json({ message: "Food not food" });
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const postFood = async (req: Request, res: Response) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: "Error processing file upload" });
    }

    try {
      // Extract form data from the request
      const { name, categoryId, steps, ingredients, description } = req.body;

      if (!name) return res.status(400).json({ message: "Name not empty" });
      if (!categoryId)
        return res.status(400).json({ message: "Categori not null" });
      if (!steps) return res.status(400).json({ message: "Step not empty" });
      if (!ingredients)
        return res.status(400).json({ message: "Ingredient not empty" });

      // If validation passes, upload the image to Cloudinary
      const uploadMiddleware = [uploadToCloudinary];
      await new Promise<void>((resolve, reject) => {
        uploadMiddleware[0](req, res, (err) => {
          if (err) return reject(err);
          resolve();
        });
      });

      // Parse steps and ingredients into arrays
      const stepsArray = Array(steps);
      const ingredientsArray = Array(ingredients);
      const imageUrl = req.file?.path || req.url; // Ensure image URL is correctly set

      // Create the new food object
      const newFood: ICreateFood = {
        categoryId: Number(categoryId),
        image: imageUrl,
        ingredients: ingredientsArray,
        name: name,
        steps: stepsArray,
        description: description,
      };

      // Store the new food item in the database
      const food = await createFood(newFood);

      return res
        .status(201)
        .json({ food, message: "Successfully added food item." });
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        return res.status(400).json({ error_createFood: error.message });
      } else {
        return res.status(500).json({ error_createFood: error });
      }
    }
  });
};

export const deleteFood = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const food = await findFoodById(id);
    if (!food)
      return res.status(404).json({
        message: "Data not found",
      });
    // Delete the image from Cloudinary if it exists
    if (food.image) {
      await deleteImageCloudinary(food.image);
    }

    await deleteFoodById(id);
    return res.status(200).json({
      message: "Delete food success",
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const putFood = async (req: Request, res: Response) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: "Error processing file upload" });
    }

    try {
      const { id } = req.params; // Get the ID from request params
      const { name, categoryId, steps, ingredients, description } = req.body;

      // Validate input data
      if (!name)
        return res.status(400).json({ message: "Name cannot be empty" });
      if (!categoryId)
        return res.status(400).json({ message: "Category cannot be null" });
      if (!steps)
        return res.status(400).json({ message: "Steps cannot be empty" });
      if (!ingredients)
        return res.status(400).json({ message: "Ingredients cannot be empty" });
      if (!req.file)
        return res.status(400).json({ message: "Image cannot be empty" });

      // Check if the food item exists
      const existingFood = await findFoodById(Number(id));
      if (!existingFood)
        return res.status(404).json({ message: "Food item not found" });

      let imageUrl = existingFood.image;

      if (req.file) {
        await new Promise<void>((resolve, reject) => {
          uploadToCloudinary(req, res, (err) => {
            if (err) return reject(err);
            resolve();
          });
        });
        await deleteImageCloudinary(existingFood.image);
        imageUrl = req.file?.path || req.url; // Ensure image URL is correctly set
      }
      // Parse steps and ingredients into arrays
      const stepsArray = steps.split(",");
      const ingredientsArray = ingredients.split(",");

      // Create the updated food object
      const newFood = {
        id: existingFood.id,
        categoryId: Number(categoryId),
        image: imageUrl,
        ingredients: ingredientsArray,
        name: name,
        steps: stepsArray,
        description: description,
      };

      // Update the food item in the database
      const food = await updateFood(newFood);

      return res
        .status(200)
        .json({ food, message: "Successfully updated food item." });
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        return res.status(400).json({ error_updateFood: error.message });
      } else {
        return res
          .status(500)
          .json({ error_updateFood: "An unexpected error occurred." });
      }
    }
  });
};
