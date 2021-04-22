const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./configDB");
const dotenv = require("dotenv").config();
const fileUpload = require("express-fileupload");
const { mkdir } = require("./utility/utils");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());
const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, "client/build")));

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

  app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`);
  });
});

app.use("/api/users", require("./routes/users"));
app.use("/api/products", require("./routes/products"));

if (process.env.NODE_ENV === "PROD") {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/client/build/index.html"));
  });
}
