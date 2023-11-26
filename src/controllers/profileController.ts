import { getProfileInfoById } from "../db/models/profileModel";
import { executeQuery } from "../db/models/queryModel";
import { authenticateToken } from "../token/authtoken";

export const getProfileInfo = (req: any, res: any, next: any) => {
  const userId = req.user.id;

  getProfileInfoById(userId, (err: any, results: any) => {
    if (err) {
      return res.status(500).json({ error: "Error interno del servidor" });
    }

    if (results.length > 0) {
      req.body.profileInfo = results;
      next();
    } else {
      res.status(404).json({ message: "Perfil no encontrado" });
    }
  });
};

export const updateProfileData = (req: any, res: any) => {
  const userId = req.user.id;

  const {
    age,
    gender,
    height,
    weight,
    foodAllergies,
    dietHabit,
    activityLevel,
    favoriteFood,
    dislikedFood,
    diets,
    goal
  } = req.body;

  const sql = `
    UPDATE Perfil
    SET edad = ?, genero = ?, altura = ?, peso = ?, alergias = ?,
        habitos_dietarios = ?, nivel_actividad_fisica = ?, favoritefood = ?,
        dislikedfood = ?, diets = ?, goal = ?
    WHERE id_perfil = ?
  `;
  const params = [
    age,
    gender,
    height,
    weight,
    dietHabit,
    activityLevel,
    foodAllergies,
    favoriteFood,
    dislikedFood,
    diets,
    goal,
    userId // Asegúrate de incluir el ID del perfil que deseas actualizar
  ];


  executeQuery(sql, params, (err: any, result: any) => {
    if (err) {
      console.error('Error al actualizar datos en la tabla Perfil:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Datos actualizados correctamente en la tabla Perfil' });
    } else {
      res.status(404).json({ message: 'Perfil no encontrado' });
    }
  });
};