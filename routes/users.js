const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sql } = require("../configDB");
const nodemailer = require("nodemailer");

router.get("/userstate", auth, (req, res) => {
  if (req.user === null) return res.json({});

  return res.json({ ...req.user });
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const body = req.body;

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

    console.log(response);
    const token = jwt.sign(
      {
        user: {
          id: response[0].id,
          email: response[0].email,
          role: response[0].role,
          name: response[0].name,
          surnames: response[0].surnames,
          address: response[0].address,
          phone: response[0].phone,
          postcode: response[0].postcode,
          city: response[0].city,
          district: response[0].district,
        },
        isLoggedIn: true,
      },
      process.env.ACCESS_TOKEN_SECRET
    );

    return res
      .cookie("token", token, {
        httpOnly: true,
      })
      .json({
        user: {
          id: response[0].id,
          email: response[0].email,
          role: response[0].role,
          name: response[0].name,
          surnames: response[0].surnames,
          address: response[0].address,
          phone: response[0].phone,
          postcode: response[0].postcode,
          city: response[0].city,
          district: response[0].district,
        },
        isLoggedIn: true,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
});

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const body = req.body;

    let response = await sql`select * from users WHERE email = ${body.email}`;

    if (response.count) {
      return res
        .status(400)
        .json({ msg: "An account already exists with this email" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    body.password = passwordHash;

    await sql`insert into users ${sql(body, "email", "password")}`;

    return res
      .status(200)
      .json({ msg: "You have been registered succesfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
});

router.get("/logout", (req, res) => {
  try {
    return res
      .cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
      })
      .json({});
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
});

router.post("/forgot", async (req, res) => {
  try {
    const query = await sql`SELECT * from users where email = ${req.body.email}`;
    if (query.count === 1) {
      const secret = process.env.ACCESS_TOKEN_SECRET + query.password;

      const payload = {
        email: query[0].email,
        id: query[0].id,
      };

      const token = jwt.sign(payload, secret, { expiresIn: "1m" });
      const link = `http://${req.headers["x-forwarded-host"]}/resetpassword/${query[0].id}/${token}`;

      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      let mailOptions = {
        from: `"FORGOT PASSWORD 👻" <${process.env.EMAIL}>`,
        to: req.body.email,
        subject: "FORGOT PASSWORD ✔",
        html: `<b>Please click on the following link, or paste this into your browser to complete the process:</b>
        <a href=${link}>click</a>`,
      };

      let info = await transporter.sendMail(mailOptions);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
});

router.post("/reset", async (req, res) => {
  try {
    const { password, id, token } = req.body;

    let response;
    try {
      response = await sql`select * from users where id = ${id}`;

      if (!response.count) return res.status(401).json({});
    } catch (error) {
      return res.status(401).json({});
    }

    const secret = process.env.ACCESS_TOKEN_SECRET + response.password;

    try {
      jwt.verify(token, secret);
    } catch (error) {
      return res.status(400).json({ msg: "Your reset link has expired" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = {
      password: passwordHash,
    };

    await sql`UPDATE users SET ${sql(user)} where id = ${id}`;

    return res.json({ msg: "Your password has been updated succesfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
});

router.post("/updateprofile", auth, async (req, res) => {
  try {
    if (req.user === null) return res.json({});

    if (!req.body.email) delete req.body.email;

    if (!req.body.password) delete req.body.password;

    await sql.begin(async (sql) => {
      const update = await sql`UPDATE users set ${sql(req.body)} WHERE id = ${
        req.user.id
      } RETURNING *`;
      console.log(update);

      const token = jwt.sign(
        {
          user: {
            id: update[0].id,
            email: update[0].email,
            role: update[0].role,
            name: update[0].name,
            surnames: update[0].surnames,
            address: update[0].address,
            phone: update[0].phone,
            postcode: update[0].postcode,
            city: update[0].city,
            district: update[0].district,
          },
          isLoggedIn: true,
        },
        process.env.ACCESS_TOKEN_SECRET
      );

      return res
        .cookie("token", token, {
          httpOnly: true,
        })
        .json({
          user: {
            id: update[0].id,
            email: update[0].email,
            role: update[0].role,
            name: update[0].name,
            surnames: update[0].surnames,
            address: update[0].address,
            phone: update[0].phone,
            postcode: update[0].postcode,
            city: update[0].city,
            district: update[0].district,
          },
          isLoggedIn: true,
        });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
});

module.exports = router;
