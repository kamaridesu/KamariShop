const postgres = require("postgres");
const dotenv = require("dotenv").config();

//conectamos a la base de datos con la configuracion el .env
const sql = postgres();

//comprobamos que la conexion se ha realizado correctamente en caso de que
//haya conectado con exito iniciamos node
const connectDB = async (callback) => {
  try {
    await sql`SELECT 2+2`;
    console.log("connected to database");
    callback();
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  sql,
  connectDB,
};
