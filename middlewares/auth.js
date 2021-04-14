const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      req.user = null;
    } else {
      const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.user = verified.user;
    }
  } catch (err) {
    return res.sendStatus(403);
  }
  next();
};

module.exports = auth;
