const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sql } = require("../configDB");

router.get("/userstate", auth, (req, res) => {
  if (req.user === null) return res.json({});

  return res.json({ ...req.user });
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const body = req.body;

    if (!email && !password) {
      return res.status(400).json({ msg: "Please enter all required fields." });
    }

    if (!email) {
      return res.status(400).json({ msg: "Please enter a email." });
    }

    if (!password) {
      return res.status(400).json({ msg: "Please enter a password." });
    }

    //await sql`SELECT * FROM users WHERE email=${email}`;
    let response = await sql`select * from users WHERE email = ${body.email}`;

    if (!response.count) {
      return res.status(400).json({ msg: "Wrong username or password." });
    }

    const decryptedPassword = await bcrypt.compare(
      password,
      response[0].password
    );

    if (!decryptedPassword) {
      return res.status(400).json({ msg: "Wrong username or password." });
    }

    const token = jwt.sign(
      {
        user: {
          id: response[0].id,
          email: response[0].email,
          role: response[0].role,
        },
      },
      process.env.ACCESS_TOKEN_SECRET
    );

    return res
      .cookie("token", token, {
        httpOnly: true,
      })
      .json(token);
  } catch (error) {
    return res.status(500).send();
  }
});

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const body = req.body;

    if (!email && !password) {
      return res.status(400).json({ msg: "Please enter all required fields." });
    }

    if (!email) {
      return res.status(400).json({ msg: "Please enter a email." });
    }

    if (!password) {
      return res.status(400).json({ msg: "Please enter a password." });
    }

    let response = await sql`select * from users WHERE email = ${body.email}`;

    if (response.count) {
      return res
        .status(400)
        .json({ msg: "An account already exists with this email" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await sql`insert into users ${sql(body, "email", "password")}`;

    return res.json({ msg: "You have been registered succesfully" });
  } catch (error) {
    //maybe make it json!
    return res.status(500).send();
  }
});

router.get("/logout", (req, res) => {
  try {
    return res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });
  } catch (error) {
    return res.status(500).send();
  }
});

module.exports = router;
