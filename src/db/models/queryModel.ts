import db from "../dbConfig";

export const executeQuery = (
  query: string,
  params: any[],
  callback: Function
) => {
  db.getConnection((err: Error, connection: any) => {
    if (err) {
      console.error("Error al obtener conexión: " + err);
      return callback(err, null);
    }

    console.log(
      `Conexión exitosa a la base de datos para la consulta: ${query}`
    );

    //una query a la base de datos quee verifique la informacion de login
    connection.query(query, params, (error: Error, results: any) => {
      connection.release(); // Liberar la conexión al pool

      if (error) {
        console.error("Error al realizar la consulta:", error);
        return callback(error, null);
      }
      
      callback(null, results);
    });
  });
};
