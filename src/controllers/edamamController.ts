// routes/edamamController.ts
import { Request, Response } from "express";
import {
  searchRecipes,
  analyzeNutrition,
  searchFoodDatabase,
  search,
  searchName,
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
  const ingr = req.body.ingr as string[];

  analyzeNutrition(ingr)
    .then((nutritionAnalysis) => res.json(nutritionAnalysis))
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    });
}

export function searchFood(req: Request, res: Response) {
  const ingr = req.query.ingr as string;

  searchFoodDatabase(ingr)
    .then((foodResults) => res.json(foodResults))
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    });
}

// Función que recibe los datos y llama a la función search que se conecta con la api
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

// Función que recibe los datos y llama a la función searchName que se conecta con la api
export function searchByName(req: any, res: any) {
  const query = req.query.q as string;

  searchName(query)
    .then((recipes) => {
      const recetas = noRepeticiones(recipes);
      res.json(recetas)})
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    });
}

function noRepeticiones(objetoJSON: any) { 
  // Se crea un objeto con la misma estructura del objetoJSON pero con hits vacío
  let recetasBuscadas = 
  {
    from: objetoJSON.from,      // Número de primera receta mostrada (1)
    to: objetoJSON.to,          // Número de última receta mostrada (20 máximo)
    count: objetoJSON.count,    // Número de recetas que coinciden con la búsqueda
    _links: objetoJSON._links,
    hits: [] as any[]           // Arreglo que contiene las recetas que son también objetos con atributos propios
  };

  for(let i = 0; i < objetoJSON.hits.length; i++){
    let noRepite = true;
    if (i < (objetoJSON.hits.length-1)){
      for(let j = i+1; j < objetoJSON.hits.length; j++){
        if(objetoJSON.hits[j].recipe.label == objetoJSON.hits[i].recipe.label){
          noRepite = false;
        }
      }
      if(noRepite){
        recetasBuscadas.hits.unshift(objetoJSON.hits[i]);
      }
    } else {
      recetasBuscadas.hits.unshift(objetoJSON.hits[i]);
    }
  }

  return recetasBuscadas;
}