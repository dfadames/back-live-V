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
        console.log("intento de loging exitoso con "+username);
        // Devuelve el token JWT como respuesta
        res.status(200).json({ token });
      } else {
        console.log("intento de loging fallido con"+username+password);
        res.status(401).send('Credenciales incorrectas');
      }
    }
  });
});

function authenticateToken(req: any, res: any, next: any) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send('Token no proporcionado');
  }

  jwt.verify(token, secretKey, (err: any, user: any) => {
    if (err) {
      return res.status(403).send('Token no válido');
    }
    req.user = user; // Almacena el usuario en el objeto de solicitud

    // Realiza una consulta SQL para obtener la id del usuario
    const username = user.username;
    const getUserIdSql = 'SELECT id_perfil FROM Usuario WHERE nombre_usuario = ?';
    
    db.query(getUserIdSql, [username], (err: any, results: any) => {
      if (err) {
        console.error('Error en la consulta SQL: ' + err);
        return res.status(500).send('Error interno del servidor');
      }

      if (results.length !== 1) {
        return res.status(404).send('Usuario no encontrado');
      }

      req.user.id = results[0].id_perfil; // Agrega la id del usuario a req.user
      next();
    });
  });
}


//register 
app.post('/register', (req: Request, res: Response) => {
  const { username, password, email } = req.body;

  const sql = 'INSERT INTO Usuario (nombre_usuario, contrasena, correo) VALUES (?, ?, ?)';

  db.query(sql, [username, password, email], (err: any) => {
    if (err) {
      let duplicate: string  = "" + err; 
      if (duplicate.includes('Duplicate')){
        console.error('Error en la consulta SQL: ' + err);
        res.status(500).send('Este usuario ya existe');
      }
      else{
      console.error('Error en la consulta SQL: ' + err);
      res.status(500).send('Error interno del servidor');
      }
    } else {
      console.error('usuario creado: ' + username);
      res.status(200).send('Registro exitoso');
    }
  });
});

app.get('/usuarios', (req: any, res: any) => {
  const query = 'SELECT * FROM Usuario';

  db.query(query, (error: any, results: any) => {
    if (error) {
      console.error('Error al realizar la consulta:', error);
      res.status(500).send('Error interno del servidor');
      return;
    }

    res.json(results);
  });
});



app.get('/perfil', authenticateToken, (req: any, res: any) => {
  // Acceso permitido solo si el token es válido
  // El usuario autenticado está disponible en req.user

  const userId = req.user.id;

  // Realiza una consulta SQL para obtener la información del perfil del usuario
  const sql = 'SELECT * FROM Perfil WHERE id_perfil = ?';

  db.query(sql, [userId], (err: any, results: any) => {
    if (err) {
      console.error('Error en la consulta SQL: ' + err);
      return res.status(500).send('Error interno del servidor');
    }
    console.log('informacion devuelta'+userId);
    // Devuelve la información del perfil del usuario
    res.json(results);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
