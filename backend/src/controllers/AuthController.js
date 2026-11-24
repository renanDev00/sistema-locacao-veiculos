const authService = require("../services/AuthService");

class AuthController {
  async login(req, res, next) {
    try {
      const resultado = await authService.login(req.body);
      return res.json(resultado);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new AuthController();
