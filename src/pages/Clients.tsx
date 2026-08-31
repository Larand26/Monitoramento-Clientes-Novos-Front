import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import ClientsTable from "../components/ClientsTable";
import { getClients } from "../apis/clients";
import type { Client } from "../interfaces/client.interface";
import * as utils from "../utils/utils";

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<
    "name" | "cnpj" | "store_id" | null
  >(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const itemsPerPage = 10;

  const fetchClientsData = async (
    page: number,
    query: string,
    activeType: string | null,
  ) => {
    setIsLoading(true);
    try {
      if (!query.trim()) {
        const response = await getClients({ page, limit: itemsPerPage });
        setClients(response.data || []);
        setTotalPages(response.pagination?.total_pages || 1);
        return;
      }

      if (activeType) {
        const params: any = { page, limit: itemsPerPage };
        if (activeType === "cnpj") {
          params.cnpj = utils.formatCnpjforApi(query);
        } else {
          params[activeType] = query;
        }

        const response = await getClients(params);
        setClients(response.data || []);
        setTotalPages(response.pagination?.total_pages || 1);
        return;
      }

      let resolvedType: "name" | "cnpj" | "store_id" = "name";
      let response = await getClients({
        name: query,
        page,
        limit: itemsPerPage,
      });

      if (response.data.length === 0) {
        response = await getClients({
          cnpj: utils.formatCnpjforApi(query),
          page,
          limit: itemsPerPage,
        });
        resolvedType = "cnpj";

        if (response.data.length === 0) {
          response = await getClients({
            store_id: query,
            page,
            limit: itemsPerPage,
          });
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
    fetchClientsData(1, "", null);
  }, []);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleSearchSubmit = () => {
    setSearchType(null);
    setCurrentPage(1);
    fetchClientsData(1, searchQuery, null);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchClientsData(nextPage, searchQuery, searchType);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      fetchClientsData(prevPage, searchQuery, searchType);
    }
  };

  return (
    <Layout page="clients" title="CLIENTES">
      <div className="w-full mt-6 flex flex-col items-center">
        <div className="w-full max-w-7xl">
          <ClientsTable
            clients={clients}
            currentPage={currentPage}
            totalPages={totalPages}
            onNextPage={handleNextPage}
            onPrevPage={handlePrevPage}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onSearchSubmit={handleSearchSubmit}
            isLoading={isLoading}
            onRefreshData={() =>
              fetchClientsData(currentPage, searchQuery, searchType)
            }
          />
        </div>
      </div>
    </Layout>
  );
}
