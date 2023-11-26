import { executeQuery } from "../db/models/queryModel";

export const getProfileInfo = (req: any, res: any, next: any) => {
  const userId = req.user.id.toString();

  const query = "SELECT * FROM Perfil WHERE id_perfil = ?";
  
  executeQuery(query, [userId], (err: any, results: any) => {
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

export const insertProfileData = (req: any, res: any) => {
  const userId = req.user.id;
  const nickname = req.user.username
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
  INSERT INTO Perfil (id_perfil,nombre,edad, genero, altura, peso, alergias, habitos_dietarios,
    nivel_actividad_fisica, favorita, no_favorita, dieta, nombre_objetivo)
  VALUES (?,?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    userId,
    nickname,
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
    goal,
    
  ];


  executeQuery(sql, params, (err: any, result: any) => {
    if (err) {
      console.error('Error al agregar datos en la tabla Perfil:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Datos agregados correctamente en la tabla Perfil' });
    } else {
      res.status(404).json({ message: 'Este usuario no existe.' });
    }
  });
};