import { useState } from "react";
import toast from "react-hot-toast";
import type { Client } from "../interfaces/client.interface";
import FlagStatus from "./FlagStatus";
import EditClientModal from "./EditClientModal";
import * as utils from "../utils/utils";
import { useAppStore } from "../store/useAppStore";
import { updateClient } from "../apis/clients"; // <-- Importação da API

interface ClientsTableProps {
  clients: Client[];
  currentPage: number;
  totalPages: number;
  onNextPage: () => void;
  onPrevPage: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: () => void;
  isLoading?: boolean;
  onRefreshData?: () => void; // <-- Prop para recarregar a tabela após edição
}

export default function ClientsTable({
  clients,
  currentPage,
  totalPages,
  onNextPage,
  onPrevPage,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  isLoading,
  onRefreshData,
}: ClientsTableProps) {
  const sellers = useAppStore((state) => state.sellers);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const handleEditClick = (client: Client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleSaveClient = async (updatedClient: Client) => {
    try {
      // 1. Monta o Partial<Client> apenas com os dados que podem ser editados no modal
      const clientData: Partial<Client> = {
        name: updatedClient.name,
        cnpj: updatedClient.cnpj,
        status: updatedClient.status,
      };

      // 2. Dispara a requisição para a API
      await updateClient(updatedClient._id, clientData);

      toast.success("Cliente atualizado com sucesso!");
      setIsModalOpen(false);
      setEditingClient(null);

      // 3. Avisa a página pai para buscar os dados atualizados
      if (onRefreshData) {
        onRefreshData();
      }
    } catch (error) {
      console.error("Error updating client:", error);
      toast.error("Ocorreu um erro ao atualizar o cliente.");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
  };

  return (
    <div className="w-full flex flex-col bg-card rounded-xl border border-muted/20 shadow-xl overflow-hidden relative">
      <div className="w-full flex justify-between items-center px-4 py-2.5 border-b border-muted/20 bg-muted/5">
        <h2 className="text-lg font-title text-main uppercase">
          Base de Clientes
        </h2>
        <div className="relative w-full max-w-[300px]">
          <input
            type="text"
            placeholder="Pressione Enter para buscar..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSearchSubmit();
              }
            }}
            disabled={isLoading}
            className="w-full bg-page text-main text-sm border border-muted/20 rounded-md pl-9 pr-3 py-1.5 outline-none focus:border-primary transition-colors duration-300 shadow-sm disabled:opacity-50"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </div>
      </div>

      <div className="overflow-auto custom-scrollbar max-h-[calc(100vh-300px)]">
        <table className="w-full text-left border-collapse relative">
          <thead className="sticky top-0 z-10 bg-card shadow-sm">
            <tr className="bg-muted/10 border-b border-muted/20">
              <th className="px-6 py-4 text-muted text-sm font-title uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-4 text-muted text-sm font-title uppercase tracking-wider">
                CNPJ
              </th>
              <th className="px-6 py-4 text-muted text-sm font-title uppercase tracking-wider">
                Vendedor
              </th>
              <th className="px-6 py-4 text-muted text-sm font-title uppercase tracking-wider text-center">
                Status
              </th>
              <th className="px-6 py-4 text-muted text-sm font-title uppercase tracking-wider text-center">
                Ações
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-muted/10">
            {isLoading ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-20 text-center text-muted text-sm"
                >
                  <span className="text-lg font-medium animate-pulse">
                    Carregando base de clientes...
                  </span>
                </td>
              </tr>
            ) : clients.length > 0 ? (
              clients.map((client) => (
                <tr
                  key={client._id}
                  className="hover:bg-muted/5 transition-colors duration-200 group"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-main text-sm font-medium">
                    {utils.removeFirstsNubersFromName(client.name)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-muted text-sm">
                    {utils.formatCNPJ(client.cnpj)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="text-main">
                      {client.seller_id
                        ? sellers[client.seller_id] || "Desconhecido"
                        : "Não atribuído"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex justify-center">
                    <FlagStatus status={client.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => handleEditClick(client)}
                      className="p-2 rounded-md text-muted hover:text-primary hover:bg-primary/10 transition-colors duration-200"
                      title="Editar Cliente"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-muted text-sm"
                >
                  Nenhum cliente encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-6 py-4 bg-muted/5 border-t border-muted/20">
        <span className="text-muted text-sm">
          Página <strong className="text-main">{currentPage}</strong> de{" "}
          <strong className="text-main">{totalPages || 1}</strong>
        </span>
        <div className="flex gap-2">
          <button
            onClick={onPrevPage}
            disabled={currentPage === 1 || isLoading}
            className="px-4 py-2 rounded-lg bg-page text-main text-sm font-medium border border-muted/20 hover:bg-muted/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            Anterior
          </button>
          <button
            onClick={onNextPage}
            disabled={
              currentPage >= totalPages || totalPages === 0 || isLoading
            }
            className="px-4 py-2 rounded-lg bg-page text-main text-sm font-medium border border-muted/20 hover:bg-muted/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            Próxima
          </button>
        </div>
      </div>

      <EditClientModal
        isOpen={isModalOpen}
        clientData={editingClient}
        onClose={handleCloseModal}
        onSave={handleSaveClient}
      />
    </div>
  );
}
