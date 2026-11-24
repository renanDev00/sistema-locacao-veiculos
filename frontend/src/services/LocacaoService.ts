import { api } from "../api/api";
import type { Locacao } from "../types/Locacao";

export const LocacaoService = {
  async listar(): Promise<Locacao[]> {
    const { data } = await api.get<Locacao[]>("/locacoes");
    return data;
  },

  async criar(payload: {
    veiculoId: number;
    dataInicio: string;
    dataFim: string;
  }): Promise<Locacao> {
    const { data } = await api.post<Locacao>("/locacoes", payload);
    return data;
  },

  async finalizar(id: number): Promise<Locacao> {
    const { data } = await api.patch<Locacao>(`/locacoes/${id}/finalizar`);
    return data;
  },
};
