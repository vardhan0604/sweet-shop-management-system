import { body } from "express-validator";

export const sweetCreateValidator = [
  body("name").notEmpty().withMessage("Name is required"),
  body("category").notEmpty().withMessage("Category is required"),
  body("price")
    .isNumeric()
    .withMessage("Price must be a number")
    .custom((value) => value > 0)
    .withMessage("Price must be greater than 0"),
  body("quantity")
    .isInt({ min: 0 })
    .withMessage("Quantity must be 0 or more")
];

export const sweetUpdateValidator = [
  body("name").optional().notEmpty().withMessage("Name cannot be empty"),
  body("category").optional().notEmpty().withMessage("Category cannot be empty"),
  body("price")
    .optional()
    .isNumeric()
    .withMessage("Price must be a number")
    .custom((value) => value > 0)
    .withMessage("Price must be greater than 0"),
  body("quantity")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Quantity must be 0 or more")
];
