//importamos las librerias
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./configDB");
const dotenv = require("dotenv").config();
const fileUpload = require("express-fileupload");
const { mkdir } = require("./utility/utils");
const fs = require("fs");

//agregamos las librerias a nuestra aplicacion node
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());
const PORT = process.env.PORT || 5000;

//indicamos el directorio de nuestro frontend
app.use(express.static(path.join(__dirname, "client/build")));

//conectamos a la bd
connectDB(async () => {
  if (process.env.NODE_ENV === "PROD") {
    if (!fs.existsSync("./client/build/images"))
      try {
        await mkdir("./client/build/images");
        console.log("Folder created");
      } catch (error) {
        console.log(error);
      }
  }

  //iniciamos nuestra aplicacion
  app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`);
  });
});

//indicamos las rutas para nuestra api
app.use("/api/users", require("./routes/users"));
app.use("/api/products", require("./routes/products"));

//cuando estemos en modo produccion en caso de acceder a un ruta de nuestra api se nos redirige
if (process.env.NODE_ENV === "PROD") {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/client/build/index.html"));
  });
}
