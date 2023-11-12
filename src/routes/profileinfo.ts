// perfilRoute.ts
import db from '../dbGeneral/dbConfig';


//exporta la informacion de perfil 
export const perfil = (req: any, res: any) => {
  const userId = req.user.id;
  const sql = 'SELECT * FROM Perfil WHERE id_perfil = ?';

  db.query(sql, [userId], (err: any, results: any) => {
    if (err) {
      console.error('Error en la consulta SQL: ' + err);
      return res.status(500).send('Error interno del servidor');
    }
    console.log('Información devuelta para el usuario con ID ' + userId);
    res.json(results);
  });
};

