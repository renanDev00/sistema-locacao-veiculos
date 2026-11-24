const prisma = require("../databases/prisma");
const ApiError = require("../errors/ApiError");

class LocacaoService {
  async findMany(usuarioId) {
    if (!usuarioId) {
      throw new ApiError("Usuário não identificado no token.", 401);
    }

    return prisma.locacao.findMany({
      where: { usuarioId: Number(usuarioId) },
      include: {
        usuario: { select: { id: true, nome: true, email: true } },
        veiculo: true,
      },
      orderBy: { id: "desc" },
    });
  }

  async create({ usuarioId, veiculoId, dataInicio, dataFim }) {
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);

    if (fim <= inicio) {
      throw new ApiError(
        "A data de devolução deve ser posterior à data de retirada.",
        400,
      );
    }

    return prisma.$transaction(async (tx) => {
      const veiculo = await tx.veiculo.findUnique({
        where: { id: Number(veiculoId) },
      });
      if (!veiculo) throw new ApiError("Veículo não encontrado.", 404);
      if (!veiculo.disponivel)
        throw new ApiError("Este veículo já está alugado no momento.", 409);

      const reserva = await tx.veiculo.updateMany({
        where: { id: Number(veiculoId), disponivel: true },
        data: { disponivel: false },
      });

      if (reserva.count === 0) {
        throw new ApiError(
          "Conflito de reserva: este veículo acabou de ser alugado.",
          409,
        );
      }

      const diffMs = fim - inicio;
      const dias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      const valorTotal = dias * veiculo.diaria;

      return tx.locacao.create({
        data: {
          usuarioId: Number(usuarioId),
          veiculoId: Number(veiculoId),
          dataInicio: inicio,
          dataFim: fim,
          valorTotal,
          status: "ATIVA",
        },
        include: {
          usuario: { select: { id: true, nome: true, email: true } },
          veiculo: true,
        },
      });
    });
  }

  async finalizar(id, usuarioId) {
    return prisma.$transaction(async (tx) => {
      const locacao = await tx.locacao.findUnique({
        where: { id: Number(id) },
      });
      if (!locacao) throw new ApiError("Locação não encontrada.", 404);
      if (locacao.usuarioId !== Number(usuarioId)) {
        throw new ApiError(
          "Você não tem permissão para finalizar esta locação.",
          403,
        );
      }
      if (locacao.status === "FINALIZADA") {
        throw new ApiError("Esta locação já foi finalizada.", 400);
      }

      const locacaoAtualizada = await tx.locacao.update({
        where: { id: Number(id) },
        data: {
          status: "FINALIZADA",
          dataDevolucao: new Date(),
        },
        include: {
          veiculo: true,
          usuario: { select: { id: true, nome: true } },
        },
      });

      await tx.veiculo.update({
        where: { id: locacao.veiculoId },
        data: { disponivel: true },
      });

      return locacaoAtualizada;
    });
  }
}

module.exports = new LocacaoService();
