// routes/edamamController.ts
import { Request, Response } from "express";
import {
  searchRecipes,
  analyzeNutrition,
  searchFoodDatabase,
  search,
} from "../extra/edamamService";

export function getRecipes(req: any, res: any) {
  const profileInfo = req.profileInfo;

  searchRecipes(profileInfo)
    .then((recipes) => res.json(recipes))
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    });
}

export function getNutritionAnalysis(req: any, res: any) {
  const ingredients = req.body.ingredients as string[];

  analyzeNutrition(ingredients)
    .then((nutritionAnalysis) => res.json(nutritionAnalysis))
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    });
}

export function searchFood(req: any, res: any) {
  const query = req.query.q as string;

  searchFoodDatabase(query)
    .then((foodResults) => res.json(foodResults))
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    });
}

export function searchByNameAndCalories(req: any, res: any) {
  const query = req.query.q as string;
  const calories = req.query.calories as string;

  search(query, calories)
    .then((recipes) => res.json(recipes))
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    });
}