import { Request, Response } from "express";
//importamos elementos necesarios
// Importa la biblioteca jsonwebtoken
const jwt = require("jsonwebtoken"); // Importa la biblioteca jsonwebtoken
import db from "../db/dbConfig";
//importamos la clave secreta
import { secretKey } from "../token/authtoken";

//se realiza una peticion post que recibe contraseña y usuario y devuelve un token de sesion
export const login = (req: Request, res: Response) => {
  // como se reecibe la informacion y para que sirve
  const { username, password } = req.body;
  // consulta
  const sql =
    "SELECT * FROM Usuario WHERE nombre_usuario = ? AND contrasena = ?";

  //una query a la base de datos quee verifique la informacion de login
  db.query(sql, [username, password], (err: Error | null, results: any) => {
    if (err) {
      console.error("Error en la consulta SQL: " + err);
      res.status(500).send("Error interno del servidor");
    } else {
      //si devuelve solo la consulta (1 parametro) la consulta eesta bien
      if (results.length === 1) {
        const user = { username: username };
        const token = jwt.sign(user, secretKey);
        console.log("intento de loging exitoso con " + username);
        // Devuelve el token JWT como respuesta
        res.status(200).json({ token });
      } else {
        console.log("intento de loging fallido con" + username + password);
        res.status(401).send("Credenciales incorrectas");
      }
    }
  });
};
//se realiza una peticion para insertar datos en la base de datos
export const register = (req: Request, res: Response) => {
  const { username, password, email } = req.body;
  const sql =
    "INSERT INTO Usuario (nombre_usuario, contrasena, correo) VALUES (?, ?, ?)";

  db.query(sql, [username, password, email], (err: any) => {
    if (err) {
      let duplicate: string = "" + err;
      if (duplicate.includes("Duplicate")) {
        console.error("Error en la consulta SQL: " + err);
        res.status(500).send("Este usuario y/o email ya esta registrado");
      } else {
        console.error("Error en la consulta SQL: " + err);
        res.status(500).send("Error interno del servidor");
      }
    } else {
      console.log("Usuario creado: " + username);
      res.status(200).send("Registro exitoso");
    }
  });
};
