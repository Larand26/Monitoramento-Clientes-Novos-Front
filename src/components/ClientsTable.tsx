import { useState } from "react";
import toast from "react-hot-toast";
import type { Client } from "../interfaces/client.interface";
import EditClientModal from "./EditClientModal";
import ClientTableRow from "./ClientTableRow";
import AdvancedFiltersModal, {
  type AdvancedFilters,
} from "./AdvancedFiltersModal";
import { useAppStore } from "../store/useAppStore";
import { updateClient } from "../apis/clients";

interface ClientsTableProps {
  clients: Client[];
  currentPage: number;
  totalPages: number;
  onNextPage: () => void;
  onPrevPage: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: () => void;
  onAddClientClick: () => void;
  onApplyAdvancedFilters: (filters: AdvancedFilters) => void;
  isLoading?: boolean;
  onRefreshData?: () => void;
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
  onAddClientClick,
  onApplyAdvancedFilters,
  isLoading,
  onRefreshData,
}: ClientsTableProps) {
  const sellers = useAppStore((state) => state.sellers);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<AdvancedFilters>({});

  const handleEditClick = (client: Client) => {
    setEditingClient(client);
    setIsEditModalOpen(true);
  };

  const handleSaveClient = async (updatedClient: Client) => {
    try {
      const clientData: Partial<Client> = {
        name: updatedClient.name,
        cnpj: updatedClient.cnpj,
        status: updatedClient.status,
      };

      await updateClient(updatedClient._id, clientData);

      toast.success("Cliente atualizado com sucesso!");
      setIsEditModalOpen(false);
      setEditingClient(null);

      if (onRefreshData) {
        onRefreshData();
      }
    } catch (error) {
      console.error("Error updating client:", error);
      toast.error("Ocorreu um erro ao atualizar o cliente.");
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingClient(null);
  };

  const handleApplyFilters = (filters: AdvancedFilters) => {
    setActiveFilters(filters);
    onApplyAdvancedFilters(filters);
  };

  const hasActiveFilters = Object.keys(activeFilters).length > 0;

  return (
    <div className="w-full flex flex-col bg-card rounded-xl border border-muted/20 shadow-xl overflow-hidden relative">
      <div className="w-full flex justify-between items-center px-4 py-2.5 border-b border-muted/20 bg-muted/5">
        <h2 className="text-lg font-title text-main uppercase">
          Base de Clientes
        </h2>

        <div className="flex items-center gap-3">
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

          <button
            onClick={() => setIsFilterModalOpen(true)}
            className={`relative px-3 py-1.5 cursor-pointer rounded-md text-sm font-medium transition-all duration-300 flex items-center gap-2 border ${
              hasActiveFilters
                ? "bg-primary/10 text-primary border-primary/50 hover:bg-primary/20"
                : "bg-page text-muted border-muted/20 hover:text-main hover:bg-muted/10"
            }`}
            title="Filtros Avançados"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.576a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
              />
            </svg>
            Filtros
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-primary absolute -top-1 -right-1"></span>
            )}
          </button>

          <button
            onClick={onAddClientClick}
            className="px-4 py-1.5 cursor-pointer rounded-md bg-page text-white text-sm font-medium hover:bg-primary/90 hover:shadow-lg transition-all duration-300 flex items-center gap-2 whitespace-nowrap"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Adicionar Cliente
          </button>
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
                Atualização
              </th>
              <th className="px-6 py-4 text-muted text-sm font-title uppercase tracking-wider text-center">
                Pedidos
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
                  colSpan={7}
                  className="px-6 py-20 text-center text-muted text-sm"
                >
                  <span className="text-lg font-medium animate-pulse">
                    Carregando base de clientes...
                  </span>
                </td>
              </tr>
            ) : clients.length > 0 ? (
              clients.map((client) => (
                <ClientTableRow
                  key={client._id}
                  client={client}
                  sellerName={
                    client.seller_id
                      ? sellers[client.seller_id] || "Desconhecido"
                      : "Não atribuído"
                  }
                  onEdit={handleEditClick}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
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
        isOpen={isEditModalOpen}
        clientData={editingClient}
        onClose={handleCloseEditModal}
        onSave={handleSaveClient}
      />

      <AdvancedFiltersModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
        currentFilters={activeFilters}
      />
    </div>
  );
}
