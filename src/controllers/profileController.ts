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
