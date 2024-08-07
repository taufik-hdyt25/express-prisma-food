import { body } from "express-validator";

export const validateFood = [
  body("name")
    .notEmpty()
    .withMessage("Name is required and cannot be empty.")
    .isLength({ min: 1 })
    .withMessage("Name must be at least 1 character long."),
  body("categoryId")
    .notEmpty()
    .withMessage("Category ID is required.")
    .isInt({ min: 1 })
    .withMessage("Category ID must be a positive integer."),
  body("steps")
    .notEmpty()
    .withMessage("Steps are required and cannot be empty.")
    .isLength({ min: 1 })
    .withMessage("Steps must be at least 1 character long."),
  body("ingredients")
    .notEmpty()
    .withMessage("Ingredients are required and cannot be empty.")
    .isLength({ min: 1 })
    .withMessage("Ingredients must be at least 1 character long."),
];
