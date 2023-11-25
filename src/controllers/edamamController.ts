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


// Función para evitar repeticiones de recetas y mostrar solo ciertos campos de la receta
function noRepeticiones(objetoJSON: any) { 
  let recetasBuscadas = 
  {
    from: objetoJSON.from,
    to: objetoJSON.to,
    count: objetoJSON.count,
    _links: objetoJSON._links,
    hits: [] as any[]
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
  // Se devuelve un objeto con solo los campos que se necesitan (filtro)
  let Busquedas = recetasBuscadas.hits.map(hit => {
    return {
      uri: hit.recipe.uri,
      label: hit.recipe.label,
      image: hit.recipe.images.SMALL,
      calories: hit.recipe.calories,
      fat: hit.recipe.totalNutrients.FAT.quantity,
      carbs: hit.recipe.totalNutrients.CHOCDF.quantity,
      protein: hit.recipe.totalNutrients.PROCNT.quantity
    };
  });
  
  return Busquedas;
}