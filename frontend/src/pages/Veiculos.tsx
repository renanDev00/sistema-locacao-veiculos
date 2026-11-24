import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { VeiculoService } from "../services/VeiculoService";
import { Navbar } from "../components/Navbar";
import type { Veiculo } from "../types/Veiculo";

export function Veiculos() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [somenteDisponiveis, setSomenteDisponiveis] = useState(false);
  const [modelo, setModelo] = useState("");
  const [marca, setMarca] = useState("");
  const [placa, setPlaca] = useState("");
  const [ano, setAno] = useState(2024);
  const [diaria, setDiaria] = useState(150);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      try {
        const lista = await VeiculoService.listar();
        if (ativo) {
          setVeiculos(lista);
        }
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

  async function handleCadastrar(e: FormEvent) {
    e.preventDefault();
    setErro("");
    setSucesso("");
    try {
      await VeiculoService.criar({
        modelo,
        marca,
        placa,
        ano: Number(ano),
        diaria: Number(diaria),
      });
      setModelo("");
      setMarca("");
      setPlaca("");
      setSucesso("Veículo cadastrado com sucesso!");
      const lista = await VeiculoService.listar();
      setVeiculos(lista);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setErro(err.response?.data?.error || "Erro ao cadastrar veículo.");
      } else {
        setErro("Erro inesperado ao cadastrar veículo.");
      }
    }
  }

  const veiculosFiltrados = somenteDisponiveis
    ? veiculos.filter((v) => v.disponivel)
    : veiculos;

  return (
    <div>
      <Navbar
        titulo="Frota de Veículos"
        linkTexto="Ir para Locações"
        linkDestino="/locacoes"
      />

      {erro && <p>{erro}</p>}
      {sucesso && <p>{sucesso}</p>}

      <form onSubmit={handleCadastrar}>
        <input
          placeholder="Marca (ex: Fiat)"
          value={marca}
          onChange={(e) => setMarca(e.target.value)}
          required
        />
        <input
          placeholder="Modelo (ex: Argo)"
          value={modelo}
          onChange={(e) => setModelo(e.target.value)}
          required
        />
        <input
          placeholder="Placa (ABC1D23)"
          value={placa}
          onChange={(e) => setPlaca(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Ano"
          value={ano}
          onChange={(e) => setAno(Number(e.target.value))}
          required
        />
        <input
          type="number"
          step="0.01"
          placeholder="Diária (R$)"
          value={diaria}
          onChange={(e) => setDiaria(Number(e.target.value))}
          required
        />
        <button type="submit">Cadastrar Veículo</button>
      </form>

      <div>
        <label>
          <input
            type="checkbox"
            checked={somenteDisponiveis}
            onChange={(e) => setSomenteDisponiveis(e.target.checked)}
          />
          Mostrar apenas veículos disponíveis para locação
        </label>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Marca / Modelo</th>
            <th>Placa</th>
            <th>Ano</th>
            <th>Diária</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {veiculosFiltrados.map((v) => (
            <tr key={v.id}>
              <td>{v.id}</td>
              <td>
                {v.marca} {v.modelo}
              </td>
              <td>{v.placa}</td>
              <td>{v.ano}</td>
              <td>R$ {v.diaria.toFixed(2)}</td>
              <td>{v.disponivel ? "Disponível" : "Alugado"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
