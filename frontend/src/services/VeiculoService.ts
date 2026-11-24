import { api } from "../api/api";
import type { NovoVeiculo, Veiculo } from "../types/Veiculo";

export const VeiculoService = {
  async listar(): Promise<Veiculo[]> {
    const { data } = await api.get<Veiculo[]>("/veiculos");
    return data;
  },

  async criar(veiculo: NovoVeiculo): Promise<Veiculo> {
    const { data } = await api.post<Veiculo>("/veiculos", veiculo);
    return data;
  },
};
