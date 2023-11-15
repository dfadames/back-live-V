import { getProfileInfoById } from "../db/models/profileModel";

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
