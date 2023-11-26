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
  const profile = profileInfo[0];
  const calories = Math.round(profile.calorias_ideales_diarias / 3);

  const commonParams = {
    app_id: RECIPE_APP_ID,
    app_key: RECIPE_APP_KEY,
    excluded: profile.alergias,
    random: "true",
    calories: `${calories - 100}-${calories + 100}`
  };

  // Parametros Edamam enviaría
  const fields = ['uri', 'label', 'image', 'images', 'calories', 'mealType'];

  // Funcion que construye en el query a mandar
  const buildQueryString = (mealType: string) => {
    const queryString = Object.entries(commonParams)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .concat(fields.map(field => `field=${encodeURIComponent(field)}`))
      .join('&');

    return `https://api.edamam.com/api/recipes/v2?type=public&${queryString}&mealType=${encodeURIComponent(mealType)}`;
  };

  // Crear requests para cada tipo de comida
  const breakfastPromise = axios.get(buildQueryString("Breakfast"));
  const lunchPromise = axios.get(buildQueryString("Lunch"));
  const dinnerPromise = axios.get(buildQueryString("Dinner"));

  return Promise.all([breakfastPromise, lunchPromise, dinnerPromise])
    .then(responses => {
      return responses.map(response => response.data.hits.slice(0, 3)).flat();
    })
    .catch(error => {
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
