const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json([
    {
      email: "1234",
      password: "aas7d6as3dsd879sa64d",
      role: "admin",
    },
    {
      email: "1234",
      password: "aas7d6as3dsd879sa64d",
      role: "user",
    },
  ]);
});

module.exports = router;
