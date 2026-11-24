const prisma = require("../databases/prisma");
const ApiError = require("../errors/ApiError");

class VeiculoService {
  async findMany(apenasDisponiveis) {
    return prisma.veiculo.findMany({
      where: apenasDisponiveis ? { disponivel: true } : undefined,
      orderBy: { id: "desc" },
    });
  }

  async findById(id) {
    const veiculo = await prisma.veiculo.findUnique({
      where: { id: Number(id) },
    });
    if (!veiculo) throw new ApiError("Veículo não encontrado.", 404);
    return veiculo;
  }

  async create(dados) {
    const placaExistente = await prisma.veiculo.findUnique({
      where: { placa: dados.placa },
    });
    if (placaExistente)
      throw new ApiError(
        "Já existe um veículo cadastrado com esta placa.",
        409,
      );

    return prisma.veiculo.create({ data: dados });
  }
}

module.exports = new VeiculoService();
