//importamos la libreria de mysql
const mysql = require('mysql');

// informacion de conexion de la base de datos
const dbConfig  = {
    host: 'bfu2fazs1bpfxo7cukcp-mysql.services.clever-cloud.com',
    user: 'ugvkyffzfh4om8qy',
    password: 'OsfBCr5kvvn7ZeSoSl3R',
    database: 'bfu2fazs1bpfxo7cukcp',
  };

  // Configura la conexión a la base de datos
const db = mysql.createConnection(dbConfig);

//realizamos la conexion a la base de datos
db.connect((err: Error| null) => {
  if (err) {
    console.error('Error de conexión a la base de datos: ' + err);
  } else {
    console.log('Conexión a la base de datos exitosa');
  }
});


export default db;
