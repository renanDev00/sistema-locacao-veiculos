const bcrypt = require("bcryptjs");
const prisma = require("../databases/prisma");
const { gerarToken } = require("../utils/jwt");
const CredenciaisInvalidaError = require("../errors/CredenciaisInvalidaError");

class AuthService {
  async login({ email, senha }) {
    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) {
      throw new CredenciaisInvalidaError();
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      throw new CredenciaisInvalidaError();
    }

    const token = gerarToken({
      id: usuario.id,
      email: usuario.email,
      nome: usuario.nome,
    });

    return {
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
    };
  }
}

module.exports = new AuthService();
