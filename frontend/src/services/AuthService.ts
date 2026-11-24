import { api } from "../api/api";
import type { AuthResponse } from "../types/Usuario";

export const AuthService = {
  async login(email: string, senha: string): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/auth/login", {
      email,
      senha,
    });
    return data;
  },

  async registrar(nome: string, email: string, senha: string) {
    const { data } = await api.post("/usuarios", { nome, email, senha });
    return data;
  },
};
