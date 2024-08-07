import { Request, Response } from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
} from "../services/category.services";
import {
  ICategory,
  ICreateCategory,
} from "../interfaces/category/interface.category";

export const getAllCatgeries = async (
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
    const [categories, total] = await getCategories(skip, limit, sort);

    // Calculate total pages
    const totalPages = Math.ceil(total / limit);

    // Determine next and previous pages
    const nextPage = page < totalPages ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    return res.status(200).json({
      data: categories,
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

export const getDataCategoryByID = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const category = await getCategoryById(id);

    if (category) {
      return res.status(200).json({
        category: category,
        message: "Success get category",
      });
    } else {
      return res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const postCategory = async (req: Request, res: Response) => {
  try {
    const body: ICreateCategory = req.body;

    const category = await createCategory(body);

    return res
      .status(404)
      .json({ category: category, message: "Success Add Category" });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const deleteCategoryById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const category = await getCategoryById(id);
    if (!category)
      return res.status(404).json({
        message: "Data not found",
      });

    await deleteCategory(id);
    return res.status(200).json({
      message: "Delete category success",
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
