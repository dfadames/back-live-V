//importamos express
import express from "express";
//creamos la app
const app = express();

//importamos la liberia para realizar las peticiones
require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
//configuracion de la app

//uso de cors
app.use(cors());
// // Analiza datos codificados en la URL
app.use(bodyParser.urlencoded({ extended: true }));
// Analiza el cuerpo de la solicitud como JSON
app.use(bodyParser.json());
//uso de ficheros
app.use(express.json());

//puerto
const PORT = 3000;

//importamos el direccionamiento de rutas:
import { login, register } from "./routes/authRoutes";
import { ping, usuarios } from "./routes/others";
import { perfil } from "./routes/profileinfo";
import {
  getRecipes,
  getNutritionAnalysis,
  searchFood,
} from "./routes/edamamController";
import { authenticateToken } from "./token/authtoken";
//configuramos las rutas con su debida funcion y metodo
//rutas de autenticacion de credenciales
app.post("/login", login);
app.post("/register", register);

//rutas de funcionalidades varias:
app.get("/ping", ping);
app.get("/usuarios", usuarios);

//rutas para el acceso de informacion del perfil
app.get("/perfil", authenticateToken, perfil);

//rutas para acceso a la api externa
app.get("/api/recipes", getRecipes);
app.post("/api/nutrition", getNutritionAnalysis);
app.get("/api/food", searchFood);

//saca la base de datos
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
