const express = require("express");
const path = require("path");
const { connectDB } = require("./configDB");
const dotenv = require("dotenv").config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, "client/build")));

if (process.env.NODE_ENV === "PROD") {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/client/build/index.html"));
  });
}

connectDB(() => {
  app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`);
  });
});

app.use("/api/users", require("./routes/users"));
