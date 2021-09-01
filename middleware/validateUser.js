const jwt = require("jsonwebtoken");

function authenticateUser(req, res, next) {
  const token = req.headers["x-auth-token"];
  if (token) {
    jwt.verify(token, process.env.APP_SECRET, function (err, decoded) {
      if (err) return res.status(401).send({ error: "Unauthorized !" }).end();
      else next();
    });
    return;
  }

  return res.status(401).send({ error: "Unauthorized !" }).end();
}

module.exports = authenticateUser;
