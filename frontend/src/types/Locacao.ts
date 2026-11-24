import type { Usuario } from "./Usuario";
import type { Veiculo } from "./Veiculo";

export interface Locacao {
  id: number;
  usuarioId: number;
  veiculoId: number;
  dataInicio: string;
  dataDevolucao?: string | null;
  dataFim: string;
  valorTotal: number;
  status: "ATIVA" | "FINALIZADA";
  usuario?: Usuario;
  veiculo?: Veiculo;
}
