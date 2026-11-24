const veiculoService = require("../services/VeiculoService");

class VeiculoController {
  async findMany(req, res, next) {
    try {
      const apenasDisponiveis = req.query.disponivel === "true";
      const veiculos = await veiculoService.findMany(apenasDisponiveis);
      return res.json(veiculos);
    } catch (error) {
      return next(error);
    }
  }

  async create(req, res, next) {
    try {
      const veiculo = await veiculoService.create(req.body);
      return res.status(201).json(veiculo);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new VeiculoController();
