const bcrypt = require("bcryptjs");
const prisma = require("../databases/prisma");
const ApiError = require("../errors/ApiError");

class UsuarioService {
  async create({ nome, email, senha }) {
    const existente = await prisma.usuario.findUnique({ where: { email } });
    if (existente) {
      throw new ApiError("E-mail já cadastrado.", 409);
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const usuario = await prisma.usuario.create({
      data: { nome, email, senha: senhaHash },
      select: { id: true, nome: true, email: true, createdAt: true },
    });

    return usuario;
  }

  async findMany() {
    return prisma.usuario.findMany({
      select: { id: true, nome: true, email: true, createdAt: true },
    });
  }
}

module.exports = new UsuarioService();
