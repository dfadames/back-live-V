import db from "../dbConfig";

export const getProfileInfoById = (userId: number, callback: Function) => {
  const sql = "SELECT * FROM Perfil WHERE id_perfil = ?";

  db.query(sql, [userId], (err: any, results: any) => {
    if (err) {
      console.error("Error en la consulta SQL: " + err);
      return callback(err, null);
    }
    console.log("Información devuelta para el usuario con ID " + userId);
    callback(null, results);
  });
};
