import db from "../dbConfig";
import { executeQuery } from "./queryModel";

export const getProfileInfoById = (userId: number, callback: Function) => {
  const sql = "SELECT * FROM Perfil WHERE id_perfil = ?";

  executeQuery(sql, [userId], callback);
};





