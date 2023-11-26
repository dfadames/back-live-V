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

  const fetchRecipes = (mealType: string, accumulatedRecipes: any[] = []): Promise<any[]> => {
    return axios.get(buildQueryString(mealType))
      .then(response => {
        const validRecipes: any[] = response.data.hits
          .filter((hit: any) => {
            const recipeCalories: number = hit.recipe.calories;
            return recipeCalories >= (calories - 100) && recipeCalories <= (calories + 100);
          })
          .map((hit: any) => hit.recipe); // Only include the recipe part

        accumulatedRecipes.push(...validRecipes);
        accumulatedRecipes = accumulatedRecipes.slice(0, 3);

        if (accumulatedRecipes.length < 3) {
          return fetchRecipes(mealType, accumulatedRecipes);
        } else {
          return Promise.resolve(accumulatedRecipes);
        }
      });
  };

  return Promise.all([
    fetchRecipes("Breakfast"),
    fetchRecipes("Lunch"),
    fetchRecipes("Dinner")
  ])
  .then(allRecipes => allRecipes.flat().map(recipe => ({ recipe }))) // Structure the data as an array of { recipe: {...} }
  .catch(error => Promise.reject(error));
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

// Busqueda en la api filtrando de acuerdo al id de la receta
export function search(id: string) {
  return axios
    .get(
      `https://api.edamam.com/api/recipes/v2/${id}?type=public&app_id=${RECIPE_APP_ID}&app_key=${RECIPE_APP_KEY}`
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
