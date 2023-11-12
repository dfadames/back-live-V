
import db from '../dbGeneral/dbConfig';


// prueba de conexion con el servidor
export const ping  = (req: any, res: any) => {
    console.log("someone just pinged here!!");
    res.send("pong");
  };
  
  // solicita la tabla usuarios de la base de datos
export const usuarios  = (req: any, res: any) => {
    const query = 'SELECT * FROM Usuario';
  
    db.query(query, (error: any, results: any) => {
    if (error) {
        console.error('Error al realizar la consulta:', error);
        res.status(500).send('Error interno del servidor');
        return;
      }
  
      res.json(results);
    });
  };
  