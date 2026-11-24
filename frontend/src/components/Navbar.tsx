import { Link, useNavigate } from "react-router-dom";
import type { Usuario } from "../types/Usuario";

interface NavbarProps {
  titulo: string;
  linkTexto: string;
  linkDestino: string;
}

export function Navbar({ titulo, linkTexto, linkDestino }: NavbarProps) {
  const navigate = useNavigate();
  const usuarioSalvo = localStorage.getItem("usuario");
  const usuario: Usuario | null = usuarioSalvo
    ? JSON.parse(usuarioSalvo)
    : null;

  function sair() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/");
  }

  return (
    <header>
      <h2>{titulo}</h2>
      {usuario && (
        <p>
          Usuário autenticado: <strong>{usuario.nome}</strong>
        </p>
      )}
      <nav>
        <Link to={linkDestino}>{linkTexto}</Link>{" "}
        <button type="button" onClick={sair}>
          Sair
        </button>
      </nav>
    </header>
  );
}
