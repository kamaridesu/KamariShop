const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sql } = require("../configDB");
const nodemailer = require("nodemailer");

//ruta para obtener el estado global del usuario
router.get("/userstate", auth, (req, res) => {
  if (req.user === null) return res.json({});

  return res.json({ ...req.user });
});

//ruta para loguear el usuario
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const body = req.body;

    //comprobamos que el email exista
    let response = await sql`select * from users WHERE email = ${body.email}`;

    if (!response.count) {
      return res.status(400).json({ msg: "Wrong username or password." });
    }

    //desencriptamos y comprobamos la contraseña introducida con la de base de datos
    const decryptedPassword = await bcrypt.compare(
      password,
      response[0].password
    );

    if (!decryptedPassword) {
      return res.status(400).json({ msg: "Wrong username or password." });
    }

    //generamos un token
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

    //devolvemos el token en forma de cookie
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

//ruta para registrar el usuario
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const body = req.body;

    //comprobamos que el email no este usado por otro usuario
    let response = await sql`select * from users WHERE email = ${body.email}`;

    if (response.count) {
      return res
        .status(400)
        .json({ msg: "An account already exists with this email" });
    }

    //encriptamos la contraseña del usuario
    const passwordHash = await bcrypt.hash(password, 10);

    body.password = passwordHash;

    //insertamos el nuevo usuario
    await sql`insert into users ${sql(body, "email", "password")}`;

    return res
      .status(200)
      .json({ msg: "You have been registered succesfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
});

//ruta para desloguear el usuario de la pagina
router.get("/logout", (req, res) => {
  try {
    //eliminamos la cookie del navegador
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

//ruta para comprobar y enviar correo de recuperacion
router.post("/forgot", async (req, res) => {
  try {
    //comprobamos que el email exista
    const query =
      await sql`SELECT * from users where email = ${req.body.email}`;
    if (query.count === 1) {
      //generamos un secret
      const secret = process.env.ACCESS_TOKEN_SECRET + query.password;

      const payload = {
        email: query[0].email,
        id: query[0].id,
      };

      let url;

      if (process.env.NODE_ENV === "PROD") {
        url = `15.237.94.17:5000`;
      } else {
        url = `localhost:3000`;
      }

      //creamos un token para verificar la validez del enlace
      const token = jwt.sign(payload, secret, { expiresIn: "1m" });
      //declaramos la ruta de la pagina web
      const link = `http://${url}/resetpassword/${query[0].id}/${token}`;

      //creamos el transporter para enviar emails a los usuarios
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      //creamos las opciones del correo
      let mailOptions = {
        from: `"FORGOT PASSWORD 👻" <${process.env.EMAIL}>`,
        to: req.body.email,
        subject: "FORGOT PASSWORD ✔",
        html: `<b>Please click on the following link, or paste this into your browser to complete the process:</b>
        <a href=${link}>click</a>`,
      };

      //nviamos el correo
      let info = await transporter.sendMail(mailOptions);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
});

//ruta para actualizar contraseña y validar el token
router.post("/reset", async (req, res) => {
  try {
    const { password, id, token } = req.body;

    let response;
    try {
      //obtenemos el usuario segun id
      response = await sql`select * from users where id = ${id}`;

      if (!response.count) return res.status(401).json({});
    } catch (error) {
      return res.status(401).json({});
    }

    //creamos el secret empleado en la generacion del token
    const secret = process.env.ACCESS_TOKEN_SECRET + response.password;

    try {
      //verificamos que el token no es valido y no haya caducado
      jwt.verify(token, secret);
    } catch (error) {
      return res.status(400).json({ msg: "Your reset link has expired" });
    }

    //encriptamos la nueva constraseña
    const passwordHash = await bcrypt.hash(password, 10);

    const user = {
      password: passwordHash,
    };

    //actualizamos la contraseña
    await sql`UPDATE users SET ${sql(user)} where id = ${id}`;

    return res.json({ msg: "Your password has been updated succesfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
});

//ruta para actualizar el perfil
router.post("/updateprofile", auth, async (req, res) => {
  try {
    //comprobamos que el usuario este logueado
    if (req.user === null) return res.json({});

    if (!req.body.email) delete req.body.email;

    if (!req.body.password) delete req.body.password;

    //empezamos la transaccion
    await sql.begin(async (sql) => {
      //actualizamos el usuario con los datos
      const update = await sql`UPDATE users set ${sql(req.body)} WHERE id = ${
        req.user.id
      } RETURNING *`;

      //regeneramos el estado de la aplicacion con los nuevos datos
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

      //enviamos la cookie
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

//ruta para eliminar el usuario
router.get("/delete", auth, async (req, res) => {
  try {
    //comprobamos que haya un usuario logueado
    if (req.user === null) return res.json({});

    //eliminamos el usuario
    await sql`delete from users where id = ${req.user.id}`;

    return res.json({});
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
});

module.exports = router;
