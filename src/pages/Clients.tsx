import { useState, useEffect, useMemo } from "react";
import Layout from "../components/Layout";
import ClientsTable from "../components/ClientsTable";
import { getClients } from "../apis/clients";
import type { Client } from "../interfaces/client.interface";

export default function Clients() {
  const [allClients, setAllClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchAllClients = async () => {
      try {
        setIsLoading(true);
        const response = await getClients({ limit: 1000 });
        setAllClients(response.data || []);
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllClients();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const filteredClients = useMemo(() => {
    if (!searchQuery.trim()) return allClients;

    const lowerQuery = searchQuery.toLowerCase();

    return allClients.filter((client) => {
      const matchName = client.name.toLowerCase().includes(lowerQuery);
      const matchCnpj = client.cnpj.includes(searchQuery);
      return matchName || matchCnpj;
    });
  }, [allClients, searchQuery]);

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentClients = filteredClients.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <Layout page="clients" title="CLIENTES">
      <div className="w-full mt-6 flex flex-col items-center">
        <div className="w-full max-w-7xl">
          <ClientsTable
            clients={currentClients}
            currentPage={currentPage}
            totalPages={totalPages}
            onNextPage={handleNextPage}
            onPrevPage={handlePrevPage}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isLoading={isLoading}
          />
        </div>
      </div>
    </Layout>
  );
}
