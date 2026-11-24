const { verificarToken } = require("../utils/jwt");
const ApiError = require("../errors/ApiError");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError("Token não fornecido.", 401));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verificarToken(token);
    req.usuario = decoded;
    return next();
  } catch (error) {
    return next(new ApiError("Token inválido ou expirado.", 401));
  }
}

module.exports = authMiddleware;
