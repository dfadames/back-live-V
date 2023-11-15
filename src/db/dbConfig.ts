//importamos la libreria de mysql
const mysql = require("mysql");

// informacion de conexion de la base de datos
const dbConfig = {
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};
// Configura la conexión a la base de datos
const db = mysql.createPool(dbConfig);

export default db;
