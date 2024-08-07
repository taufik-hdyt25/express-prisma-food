import { Router } from "express";

import {
  deleteCategoryById,
  getAllCatgeries,
  getDataCategoryByID,
  postCategory,
} from "../controllers/category.controller";

const routerCategories = Router();

routerCategories.get("/categories", getAllCatgeries);
routerCategories.get("/category/:id", getDataCategoryByID);
routerCategories.post("/category", postCategory);
routerCategories.delete("/category/:id", deleteCategoryById);

export default routerCategories;
