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
const PORT = process.env.PORT;

//importamos el direccionamiento de rutas:
import { login, register } from "./controllers/authController";
import { ping, getUsuarios } from "./controllers/othersController";
import { getProfileInfo } from "./controllers/profileController";
import {
  getRecipes,
  getNutritionAnalysis,
  searchFood,
  searchById,
  searchByName,
} from "./controllers/edamamController";
import { authenticateToken } from "./token/authtoken";
const getProfileData = [authenticateToken, getProfileInfo];
//configuramos las rutas con su debida funcion y metodo
//rutas de autenticacion de credenciales
app.post("/login", login);
app.post("/register", register);

//rutas de funcionalidades varias:
app.get("/ping", ping);
app.get("/usuarios", getUsuarios);

//rutas para el acceso de informacion del perfil
app.get("/perfil", getProfileData, (req: any, res: any) => {
  res.json(req.body.profileInfo[0]);
});

//rutas para acceso a la api externa
app.get("/api/recetas", getProfileData, getRecipes);
app.post("/api/nutricion", getNutritionAnalysis);
app.get("/api/comida", searchFood);
app.get("/api/buscador", searchById);
app.get("/api/buscanombre", searchByName);

//saca la base de datos
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
