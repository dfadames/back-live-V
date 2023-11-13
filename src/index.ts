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
import { login, register } from "./controllers/authController";
import { ping, getUsuarios } from "./controllers/others";
import { getProfileInfo } from "./controllers/profileController";
import {
  getRecipes,
  getNutritionAnalysis,
  searchFood,
} from "./controllers/edamamController";
import { authenticateToken } from "./token/authtoken";
//configuramos las rutas con su debida funcion y metodo
//rutas de autenticacion de credenciales
app.post("/login", login);
app.post("/register", register);

//rutas de funcionalidades varias:
app.get("/ping", ping);
app.get("/usuarios", getUsuarios);

//rutas para el acceso de informacion del perfil
app.get("/perfil", authenticateToken, getProfileInfo);

//rutas para acceso a la api externa
app.get("/api/recetas", getRecipes);
app.post("/api/nutricion", getNutritionAnalysis);
app.get("/api/comida", searchFood);

//saca la base de datos
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
