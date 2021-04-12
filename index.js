const express = require("express");
const path = require("path");
const dotenv = require("dotenv").config();

const app = express();

app.use(express.static(path.join(__dirname, "client/build")));

if (process.env.NODE_ENV === "PROD") {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/client/build/index.html"));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});

app.use("/api/users", require("./routes/users"));
