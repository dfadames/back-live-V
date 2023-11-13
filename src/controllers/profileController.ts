import { getProfileInfoById } from "../db/models/profileModel";

export const getProfileInfo = (req: any, res: any) => {
  const userId = req.user.id;

  getProfileInfoById(userId, (err: any, results: any) => {
    if (err) {
      return res.status(500).json({ error: "Error interno del servidor" });
    }
    res.json(results);
  });
};
