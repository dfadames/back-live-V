// routes/edamamController.ts
import { Request, Response } from "express";
import {
  searchRecipes,
  analyzeNutrition,
  searchFoodDatabase,
} from "../extra/edamamService";

export function getRecipes(req: Request, res: Response) {
  const profileInfo = req.body.profileInfo;

  searchRecipes(profileInfo)
    .then((recipes) => res.json(recipes))
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    });
}

export function getNutritionAnalysis(req: Request, res: Response) {
  const ingredients = req.body.ingredients as string[];

  analyzeNutrition(ingredients)
    .then((nutritionAnalysis) => res.json(nutritionAnalysis))
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    });
}

export function searchFood(req: Request, res: Response) {
  const query = req.query.q as string;

  searchFoodDatabase(query)
    .then((foodResults) => res.json(foodResults))
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    });
}
