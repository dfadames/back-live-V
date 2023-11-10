import express from "express";
import { Request, Response } from 'express';

const app = express();
app.use(express.json());

//importamos la liberia para realizar las peticiones
const mysql = require('mysql');
const bodyParser = require('body-parser');
const dbConfig = require('./dbConfig');
const jwt = require('jsonwebtoken'); // Importa la biblioteca jsonwebtoken
const cors = require('cors');
app.use(cors());

const PORT = 3000;
const secretKey = '1234'; // Clave secreta para firmar el token JWT

app.get("/ping", (req, res) => {
  console.log("someone just pinged here!!");
  res.send("pong");
});



// Configura la conexión a la base de datos
const db = mysql.createConnection(dbConfig);

//realizamos la conexion a la base de datos
db.connect((err: Error| null) => {
  if (err) {
    console.error('Error de conexión a la base de datos: ' + err);
  } else {
    console.log('Conexión a la base de datos exitosa');
  }
});
// // Analiza datos codificados en la URL
app.use(bodyParser.urlencoded({ extended: true }));
// Analiza el cuerpo de la solicitud como JSON
app.use(bodyParser.json());

//se realiza una peticion post que recibe contraseña y usuario y devuelve un token de sesion
app.post('/login', (req: Request, res: Response) => {
  // como se reecibe la informacion y para que sirve
  const { username, password } = req.body;
  // consulta 
  const sql = 'SELECT * FROM Usuario WHERE nombre_usuario = ? AND contrasena = ?';

  //una query a la base de datos quee verifique la informacion de login
  db.query(sql, [username, password], (err: Error| null, results: any) => {
    if (err) {
      console.error('Error en la consulta SQL: ' + err);
      res.status(500).send('Error interno del servidor');
    } else {
      //si devuelve solo la consulta (1 parametro) la consulta eesta bien 
      if (results.length === 1) {
        const user = { username: username };
        const token = jwt.sign(user, secretKey);

        // Devuelve el token JWT como respuesta
        res.status(200).json({ token });
      } else {
        res.status(401).send('Credenciales incorrectas');
      }
    }
  });
});
//register 
app.post('/register', (req: Request, res: Response) => {
  const { username, password, email } = req.body;

  const sql = 'INSERT INTO Usuario (nombre_usuario, contrasena, correo) VALUES (?, ?, ?)';

  db.query(sql, [username, password, email], (err: any, result: any) => {
    if (err) {
      console.error('Error en la consulta SQL: ' + err);
      res.status(500).send('Error interno del servidor');
    } else {
      res.status(200).send('Registro exitoso');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
