import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import ClientsTable from "../components/ClientsTable";
import CreateClientDrawer from "../components/CreateClientDrawer";
import { getClients } from "../apis/clients";
import type { Client } from "../interfaces/client.interface";
import type { AdvancedFilters } from "../components/AdvancedFiltersModal";
import * as utils from "../utils/utils";

// Estende os parâmetros originais da API para incluir o novo filtro de pedidos (min_orders)
// sem quebrar a tipagem estrita e sem precisar modificar clients.ts agora.
type ClientApiParams = Parameters<typeof getClients>[0] & {
  min_orders?: number;
};

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<
    "name" | "cnpj" | "store_id" | null
  >(null);

  const [activeFilters, setActiveFilters] = useState<AdvancedFilters>({});

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const itemsPerPage = 10;

  const fetchClientsData = async (
    page: number,
    query: string,
    activeType: string | null,
    filters: AdvancedFilters,
  ) => {
    setIsLoading(true);
    try {
      const baseParams: ClientApiParams = {
        page,
        limit: itemsPerPage,
      };

      if (filters.created_start)
        baseParams.created_start = filters.created_start;
      if (filters.created_end) baseParams.created_end = filters.created_end;
      if (filters.updated_start)
        baseParams.updated_start = filters.updated_start;
      if (filters.updated_end) baseParams.updated_end = filters.updated_end;
      if (filters.min_orders !== undefined)
        baseParams.min_orders = filters.min_orders;

      // Realizando um cast seguro para garantir que a tipagem não quebre caso o seller_id
      // no banco seja uma string (ObjectId) em vez de um number como tipado originalmente.
      if (filters.seller_id) {
        baseParams.seller_id = filters.seller_id as unknown as number;
      }

      if (!query.trim()) {
        const response = await getClients(
          baseParams as Parameters<typeof getClients>[0],
        );
        setClients(response.data || []);
        setTotalPages(response.pagination?.total_pages || 1);
        return;
      }

      if (activeType) {
        const params: ClientApiParams = { ...baseParams };

        if (activeType === "cnpj") {
          params.cnpj = utils.formatCnpjforApi(query);
        } else {
          // Atribuição tipada de forma segura
          Object.assign(params, { [activeType]: query });
        }

        const response = await getClients(
          params as Parameters<typeof getClients>[0],
        );
        setClients(response.data || []);
        setTotalPages(response.pagination?.total_pages || 1);
        return;
      }

      let resolvedType: "name" | "cnpj" | "store_id" = "name";
      let response = await getClients({
        ...baseParams,
        name: query,
      } as Parameters<typeof getClients>[0]);

      if (response.data.length === 0) {
        response = await getClients({
          ...baseParams,
          cnpj: utils.formatCnpjforApi(query),
        } as Parameters<typeof getClients>[0]);
        resolvedType = "cnpj";

        if (response.data.length === 0) {
          response = await getClients({
            ...baseParams,
            store_id: query,
          } as Parameters<typeof getClients>[0]);
          resolvedType = "store_id";
        }
      }

      setSearchType(resolvedType);
      setClients(response.data || []);
      setTotalPages(response.pagination?.total_pages || 1);
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClientsData(1, "", null, {});
  }, []);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleSearchSubmit = () => {
    setSearchType(null);
    setCurrentPage(1);
    fetchClientsData(1, searchQuery, null, activeFilters);
  };

  const handleApplyAdvancedFilters = (filters: AdvancedFilters) => {
    setActiveFilters(filters);
    setCurrentPage(1);
    fetchClientsData(1, searchQuery, searchType, filters);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchClientsData(nextPage, searchQuery, searchType, activeFilters);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      fetchClientsData(prevPage, searchQuery, searchType, activeFilters);
    }
  };

  const refreshCurrentPage = () => {
    fetchClientsData(currentPage, searchQuery, searchType, activeFilters);
  };

  return (
    <Layout page="clients">
      <div className="w-full mt-6 flex flex-col items-center">
        <div className="w-full max-w-7xl flex flex-col gap-4">
          <ClientsTable
            clients={clients}
            currentPage={currentPage}
            totalPages={totalPages}
            onNextPage={handleNextPage}
            onPrevPage={handlePrevPage}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onSearchSubmit={handleSearchSubmit}
            onAddClientClick={() => setIsDrawerOpen(true)}
            onApplyAdvancedFilters={handleApplyAdvancedFilters}
            isLoading={isLoading}
            onRefreshData={refreshCurrentPage}
          />
        </div>
      </div>

      <CreateClientDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onRefreshData={refreshCurrentPage}
      />
    </Layout>
  );
}
