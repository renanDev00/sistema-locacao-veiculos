const usuarioService = require("../services/UsuarioService");

class UsuarioController {
  async create(req, res, next) {
    try {
      const usuario = await usuarioService.create(req.body);
      return res.status(201).json(usuario);
    } catch (error) {
      return next(error);
    }
  }

  async findMany(req, res, next) {
    try {
      const usuarios = await usuarioService.findMany();
      return res.json(usuarios);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new UsuarioController();
