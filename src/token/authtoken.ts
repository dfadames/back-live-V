// authToken.js
const jwt = require("jsonwebtoken");
import db from "../db/dbConfig";
// Clave secreta para firmar el token JWT
//la exportamos para uso general
export const secretKey = process.env.JWT_SECRET;

//autentica un token
export function authenticateToken(req: any, res: any, next: any) {
  //toma el token del header
  const token = req.headers.authorization;
  //no hay token
  if (!token) {
    return res.status(401).send("Token no proporcionado");
  }
  //usa jwt para verificar que el token si exista, y extrae el usuario de el
  jwt.verify(token, secretKey, (err: any, user: any) => {
    if (err) {
      return res.status(403).send("Token no válido");
    }
    req.user = user; // Almacena el usuario en el objeto de solicitud

    // Realiza una consulta SQL para obtener la id del usuario con el usuario obtenido del token
    const username = user.username;
    const getUserIdSql =
      "SELECT id_perfil FROM Usuario WHERE nombre_usuario = ?";

    db.query(getUserIdSql, [username], (err: any, results: any) => {
      if (err) {
        console.error("Error en la consulta SQL: " + err);
        return res.status(500).send("Error interno del servidor");
      }

      if (results.length !== 1) {
        
        return res.status(404).send("Usuario no encontrado");
      }

      req.user.id = results[0].id_perfil; // Agrega la id del usuario a req.user
      next();
    });
  });
}
