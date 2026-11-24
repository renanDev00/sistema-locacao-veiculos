export interface Veiculo {
  id: number;
  modelo: string;
  marca: string;
  placa: string;
  ano: number;
  diaria: number;
  disponivel: boolean;
}

export type NovoVeiculo = Omit<Veiculo, "id" | "disponivel">;
