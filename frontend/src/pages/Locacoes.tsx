import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LocacaoService } from "../services/LocacaoService";
import { VeiculoService } from "../services/VeiculoService";
import { Navbar } from "../components/Navbar";
import type { Locacao } from "../types/Locacao";
import type { Veiculo } from "../types/Veiculo";

export function Locacoes() {
  const [locacoes, setLocacoes] = useState<Locacao[]>([]);
  const [veiculosDisponiveis, setVeiculosDisponiveis] = useState<Veiculo[]>([]);
  const [veiculoId, setVeiculoId] = useState<number>(0);
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const navigate = useNavigate();

  async function atualizarDados() {
    const [listaLocacoes, listaVeiculos] = await Promise.all([
      LocacaoService.listar(),
      VeiculoService.listar(),
    ]);
    setLocacoes(listaLocacoes);
    const disponiveis = listaVeiculos.filter((v) => v.disponivel);
    setVeiculosDisponiveis(disponiveis);
    setVeiculoId(disponiveis.length > 0 ? disponiveis[0].id : 0);
  }

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      try {
        const [listaLocacoes, listaVeiculos] = await Promise.all([
          LocacaoService.listar(),
          VeiculoService.listar(),
        ]);
        if (!ativo) return;
        setLocacoes(listaLocacoes);
        const disponiveis = listaVeiculos.filter((v) => v.disponivel);
        setVeiculosDisponiveis(disponiveis);
        setVeiculoId(disponiveis.length > 0 ? disponiveis[0].id : 0);
      } catch {
        if (ativo) {
          navigate("/");
        }
      }
    }

    carregar();

    return () => {
      ativo = false;
    };
  }, [navigate]);

  async function handleAlugar(e: FormEvent) {
    e.preventDefault();
    setErro("");
    setSucesso("");
    try {
      await LocacaoService.criar({
        veiculoId: Number(veiculoId),
        dataInicio,
        dataFim,
      });
      setDataInicio("");
      setDataFim("");
      setSucesso("Locação registrada com sucesso!");
      await atualizarDados();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setErro(err.response?.data?.error || "Erro ao registrar locação.");
      } else {
        setErro("Erro inesperado ao registrar locação.");
      }
    }
  }

  async function handleDevolver(id: number) {
    setErro("");
    setSucesso("");
    try {
      await LocacaoService.finalizar(id);
      setSucesso("Locação finalizada e veículo devolvido!");
      await atualizarDados();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setErro(err.response?.data?.error || "Erro ao finalizar locação.");
      } else {
        setErro("Erro inesperado ao finalizar locação.");
      }
    }
  }

  return (
    <div>
      <Navbar
        titulo="Minhas Locações"
        linkTexto="Voltar para Veículos"
        linkDestino="/veiculos"
      />

      {erro && <p>{erro}</p>}
      {sucesso && <p>{sucesso}</p>}

      <form onSubmit={handleAlugar}>
        <select
          value={veiculoId}
          onChange={(e) => setVeiculoId(Number(e.target.value))}
          required
        >
          <option value={0} disabled>
            Selecione um veículo disponível
          </option>
          {veiculosDisponiveis.map((v) => (
            <option key={v.id} value={v.id}>
              {v.marca} {v.modelo} ({v.placa}) - R$ {v.diaria}/dia
            </option>
          ))}
        </select>
        <input
          type="date"
          value={dataInicio}
          onChange={(e) => setDataInicio(e.target.value)}
          required
        />
        <input
          type="date"
          value={dataFim}
          onChange={(e) => setDataFim(e.target.value)}
          required
        />
        <button type="submit" disabled={veiculosDisponiveis.length === 0}>
          Registrar Locação
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Veículo</th>
            <th>Período Previsto</th>
            <th>Data de Devolução</th>
            <th>Valor Total</th>
            <th>Status</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {locacoes.map((l) => (
            <tr key={l.id}>
              <td>{l.id}</td>
              <td>
                {l.veiculo?.marca} {l.veiculo?.modelo} ({l.veiculo?.placa})
              </td>
              <td>
                {new Date(l.dataInicio).toLocaleDateString("pt-BR")} até{" "}
                {new Date(l.dataFim).toLocaleDateString("pt-BR")}
              </td>
              <td>
                {l.dataDevolucao
                  ? new Date(l.dataDevolucao).toLocaleString("pt-BR")
                  : "-"}
              </td>
              <td>R$ {l.valorTotal.toFixed(2)}</td>
              <td>{l.status}</td>
              <td>
                {l.status === "ATIVA" && (
                  <button type="button" onClick={() => handleDevolver(l.id)}>
                    Devolver Veículo
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
