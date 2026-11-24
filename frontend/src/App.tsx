import type { ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { Veiculos } from "./pages/Veiculos";
import { Locacoes } from "./pages/Locacoes";

function RotaPrivada({ children }: { children: ReactNode }) {
  const token = localStorage.getItem("token");
  return token ? <>{children}</> : <Navigate to="/" replace />;
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/veiculos"
          element={
            <RotaPrivada>
              <Veiculos />
            </RotaPrivada>
          }
        />
        <Route
          path="/locacoes"
          element={
            <RotaPrivada>
              <Locacoes />
            </RotaPrivada>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
