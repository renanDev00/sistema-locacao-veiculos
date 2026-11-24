import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthService } from "../services/AuthService";

export function Login() {
  const [modoCadastro, setModoCadastro] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro("");
    setSucesso("");
    setEnviando(true);

    try {
      if (modoCadastro) {
        await AuthService.registrar(nome, email, senha);
        setModoCadastro(false);
        setNome("");
        setSenha("");
        setSucesso(
          "Cadastro realizado com sucesso! Faça login para continuar.",
        );
        return;
      }

      const res = await AuthService.login(email, senha);
      localStorage.setItem("token", res.token);
      localStorage.setItem("usuario", JSON.stringify(res.usuario));
      navigate("/veiculos");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setErro(err.response?.data?.error || "Erro ao autenticar.");
      } else {
        setErro("Erro inesperado ao conectar com o servidor.");
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div>
      <h2>{modoCadastro ? "Criar Conta" : "Login — Locadora"}</h2>
      {erro && <p>{erro}</p>}
      {sucesso && <p>{sucesso}</p>}
      <form onSubmit={handleSubmit}>
        {modoCadastro && (
          <div>
            <input
              placeholder="Nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>
        )}
        <div>
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={enviando}>
          {enviando ? "Aguarde..." : modoCadastro ? "Cadastrar" : "Entrar"}
        </button>
      </form>
      <button
        type="button"
        onClick={() => {
          setModoCadastro(!modoCadastro);
          setErro("");
          setSucesso("");
        }}
      >
        {modoCadastro
          ? "Já tenho conta (Fazer Login)"
          : "Não tem conta? Cadastre-se"}
      </button>
    </div>
  );
}
