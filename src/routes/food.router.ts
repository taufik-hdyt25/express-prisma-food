import { Router } from "express";

import {
  deleteFood,
  getAllFoods,
  getFoodById,
  postFood,
  putFood,
} from "../controllers/food.controller";

const routerCategories = Router();

routerCategories.get("/foods", getAllFoods);
routerCategories.get("/food/:id", getFoodById);
routerCategories.post("/food", postFood);
routerCategories.put("/food/:id", putFood);
routerCategories.delete("/food/:id", deleteFood);

export default routerCategories;
