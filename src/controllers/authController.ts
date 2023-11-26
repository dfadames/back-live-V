import { Request, Response } from "express";
//importamos elementos necesarios
// Importa la biblioteca jsonwebtoken
const jwt = require("jsonwebtoken"); // Importa la biblioteca jsonwebtoken
import db from "../db/dbConfig";
//importamos la clave secreta
import { secretKey } from "../token/authtoken";
import { executeQuery } from "../db/models/queryModel";

//se realiza una peticion post que recibe contraseña y usuario y devuelve un token de sesion
export const login = (req: Request, res: Response) => {
  // como se reecibe la informacion y para que sirve
  const { username, password } = req.body;
  // consulta
  const query =
    "SELECT * FROM Usuario WHERE nombre_usuario = ? AND contrasena = ?";

  // se ejecuta el query creandose una conexión
  executeQuery(query, [username, password], (err: Error, results: any) => {
    if (err) {
      return res.status(500).json({ error: "Error interno del servidor" });
    }

    //si devuelve solo la consulta (1 parametro) la consulta eesta bien
    if (results.length === 1) {
      const user = { username: username };
      const token = jwt.sign(user, secretKey);
      console.log("intento de loging exitoso con " + username);
      // Devuelve el token JWT como respuesta
      res.status(200).json({ token });
    } else {
      console.log("intento de loging fallido con " + username + password);
      res.status(401).json({ error: "Credenciales incorrectas" });
    }
  });
};

//se realiza una peticion para insertar datos en la base de datos
export const register = (req: Request, res: Response) => {
  const { username, password, email } = req.body;
  const query =
    "INSERT INTO Usuario (nombre_usuario, contrasena, correo) VALUES (?, ?, ?)";

  executeQuery(query, [username, password, email], (err: Error) => {
    if (err) {
      let errorMessage = "" + err;
      if (errorMessage.includes("Duplicate")) {
        res
          .status(400)
          .json({ error: "Este usuario y/o email ya está registrado" });
      } else {
        console.error("Error en la consulta SQL: " + err);
        res.status(500).json({ error: "Error interno del servidor" });
      }
    } else {
      console.log("Usuario creado: " + username);
      const user = { username: username };
      const token = jwt.sign(user, secretKey);
      res.status(200).json({ token });
    }
  });
};
