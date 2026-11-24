const ApiError = require("./ApiError");

class CredenciaisInvalidaError extends ApiError {
  constructor(message = "E-mail ou senha inválidos.") {
    super(message, 401);
  }
}

module.exports = CredenciaisInvalidaError;
