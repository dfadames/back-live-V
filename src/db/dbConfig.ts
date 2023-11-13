//importamos la libreria de mysql
const mysql = require("mysql");

// informacion de conexion de la base de datos
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};
// Configura la conexión a la base de datos
const db = mysql.createConnection(dbConfig);

//realizamos la conexion a la base de datos
db.connect((err: Error | null) => {
  if (err) {
    console.error("Error de conexión a la base de datos: " + err);
  } else {
    console.log("Conexión a la base de datos exitosa");
  }
});

export default db;
