const locacaoService = require("../services/LocacaoService");

class LocacaoController {
  async findMany(req, res, next) {
    try {
      const locacoes = await locacaoService.findMany(req.usuario.id);
      return res.json(locacoes);
    } catch (error) {
      return next(error);
    }
  }

  async create(req, res, next) {
    try {
      const locacao = await locacaoService.create({
        ...req.body,
        usuarioId: req.usuario.id,
      });
      return res.status(201).json(locacao);
    } catch (error) {
      return next(error);
    }
  }

  async finalizar(req, res, next) {
    try {
      const locacao = await locacaoService.finalizar(
        req.params.id,
        req.usuario.id,
      );
      return res.json(locacao);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new LocacaoController();
