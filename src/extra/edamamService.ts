import axios from "axios";

const RECIPE_APP_ID = process.env.RECIPE_EDAMAM_API_ID;
const RECIPE_APP_KEY = process.env.RECIPE_EDAMAM_API_KEY;

const NUTRITION_APP_ID = process.env.NUTRITION_EDAMAM_API_ID;
const NUTRITION_APP_KEY = process.env.NUTRITION_EDAMAM_API_KEY;

const FOOD_APP_ID = process.env.FOOD_EDAMAM_API_ID;
const FOOD_APP_KEY = process.env.FOOD_EDAMAM_API_KEY;

if (
  !RECIPE_APP_ID ||
  !RECIPE_APP_KEY ||
  !NUTRITION_APP_ID ||
  !NUTRITION_APP_KEY ||
  !FOOD_APP_ID ||
  !FOOD_APP_KEY
) {
  throw new Error(
    "One or more of the required API IDs or keys not found in environment variables"
  );
}

export function searchRecipes(profileInfo: any) {
  const edamamApiUrl = `https://api.edamam.com/api/recipes/v2?type=public&app_id=${RECIPE_APP_ID}&app_key=${RECIPE_APP_KEY}&excluded=${profileInfo.alergias}`;

  return axios
    .get(edamamApiUrl)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
}

export function analyzeNutrition(ingr: string[]) {
  return axios
    .post(
      "https://api.edamam.com/api/nutrition-details",
      { ingr },
      { params: { app_id: NUTRITION_APP_ID, app_key: NUTRITION_APP_KEY } }
    )
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
}

export function searchFoodDatabase(ingr: string) {
  return axios
    .get(
      `https://api.edamam.com/api/food-database/v2/parser?ingr=${ingr}&app_id=${FOOD_APP_ID}&app_key=${FOOD_APP_KEY}`
    )
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
}

// Busqueda en la api filtrando de acuerdo al nombre de la receta y un aproximado de calorias
export function search(query: string, calories: string) {
  return axios
    .get(
      `https://api.edamam.com/api/recipes/v2?type=public&q=${query}&app_id=${RECIPE_APP_ID}&app_key=${RECIPE_APP_KEY}&calories=${calories}`
    )
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
}

// Busqueda en la api filtrando de acuerdo al nombre de la receta
export function searchName(query: string) {
  return axios
    .get(
      `https://api.edamam.com/api/recipes/v2?type=public&q=${query}&app_id=${RECIPE_APP_ID}&app_key=${RECIPE_APP_KEY}`
    )
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
}
