const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "chave_padrao";

function gerarToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: "8h" });
}

function verificarToken(token) {
  return jwt.verify(token, SECRET);
}

module.exports = { gerarToken, verificarToken };
