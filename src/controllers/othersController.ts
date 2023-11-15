import db from "../db/dbConfig";
import { executeQuery } from "../db/models/queryModel";

// prueba de conexion con el servidor
export const ping = (req: any, res: any) => {
  console.log("someone just pinged here!!");
  res.send("pong");
};

// solicita la tabla usuarios de la base de datos
export const getUsuarios = (req: any, res: any) => {
  const query = "SELECT * FROM Usuario";

  executeQuery(query, [], (error: Error, results: any) => {
    if (error) {
      res.status(500).send("Error interno del servidor");
    } else {
      res.json(results);
    }
  });
};
