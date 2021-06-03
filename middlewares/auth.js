const jwt = require("jsonwebtoken");

//creamos un middleware para ofrecer seguridad a nuestra api
const auth = (req, res, next) => {
  try {
    //recogemos el token
    const token = req.cookies.token;

    //si no existe usuario lo guardamos como null
    if (!token) {
      req.user = null;
    } else {
      //verificamos el token
      const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      //enviamos el usuario del token a la siguiente funcion
      req.user = verified.user;
    }
  } catch (err) {
    return res.sendStatus(403);
  }
  //permitimos el paso a la siguiente funcion
  next();
};

module.exports = auth;
