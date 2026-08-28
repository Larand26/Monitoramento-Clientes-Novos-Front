import { useState } from "react";
import { Link } from "react-router-dom"; // Importação vital para navegação sem reload
import isoLogo from "../assets/logo-isologo_white.svg";
import { useAppStore } from "../store/useAppStore";

export default function NavBar(props: { page?: string }) {
  const linkClasses = "text-main hover:text-gray-300 transition-colors";

  const currentUser = useAppStore((state) => state.currentUser);
  const initializeAppData = useAppStore((state) => state.initializeAppData);

  // Estado para controlar a animação de giro do botão
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await initializeAppData(); // Bate na API novamente
    setIsRefreshing(false);
  };

  return (
    <nav className="bg-card py-2 px-4 flex justify-between items-center shadow-md">
      <div>
        <img src={isoLogo} alt="Logo" className="w-15" />
      </div>

      <div>
        <ul className="flex gap-10">
          <li>
            {/* Trocamos <a> por <Link> e href por to */}
            <Link
              to="/home"
              className={`${linkClasses} ${props.page === "home" ? "text-primary" : ""}`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/dashboards"
              className={`${linkClasses} ${props.page === "dashboards" ? "text-primary" : ""}`}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/clients"
              className={`${linkClasses} ${props.page === "clients" ? "text-primary" : ""}`}
            >
              Clientes
            </Link>
          </li>
        </ul>
      </div>

      <div className="flex items-center gap-4">
        {/* Botão de Refresh */}
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="p-2 rounded-full text-muted hover:text-main hover:bg-muted/20 transition-all disabled:opacity-50"
          title="Atualizar Sistema"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`w-5 h-5 cursor-pointer ${isRefreshing ? "animate-spin" : ""}`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
        </button>

        {/* Divisor Visual e Dados do Usuário */}
        <div className="flex flex-col items-end border-l border-muted/20 pl-4"></div>
      </div>
    </nav>
  );
}
