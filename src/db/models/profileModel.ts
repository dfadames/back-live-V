import db from "../dbConfig";

export const getProfileInfoById = (userId: number, callback: Function) => {
  const sql = "SELECT * FROM Perfil WHERE id_perfil = ?";

  db.getConnection((err: Error, connection: any) => {
    if (err) {
      console.error("Error al obtener conexión: " + err);
      return callback(err, null);
    }

    console.log(`Conexión exitosa a la base de datos para la consulta: ${sql}`);

    connection.query(sql, [userId], (err: Error, results: any) => {
      connection.release(); // Liberar la conexión

      if (err) {
        console.error("Error en la consulta SQL: " + err);
        return callback(err, null);
      }

      console.log("Información devuelta para el usuario con ID " + userId);
      callback(null, results);
    });
  });
};
