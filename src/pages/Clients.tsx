import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import ClientsTable from "../components/ClientsTable";
import { getClients } from "../apis/clients";
import type { Client } from "../interfaces/client.interface";

export default function Clients() {
  const [allClients, setAllClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchAllClients = async () => {
      try {
        setIsLoading(true);
        // Busca um lote de até 1000 clientes na montagem da página
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

  // Lógica de fatiamento (slice) para a paginação local
  const totalPages = Math.ceil(allClients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentClients = allClients.slice(
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
          {isLoading ? (
            <div className="w-full flex justify-center py-20 bg-card rounded-xl border border-muted/20 shadow-xl">
              <span className="text-muted text-lg font-medium animate-pulse">
                Carregando base de clientes...
              </span>
            </div>
          ) : (
            <ClientsTable
              clients={currentClients}
              currentPage={currentPage}
              totalPages={totalPages}
              onNextPage={handleNextPage}
              onPrevPage={handlePrevPage}
            />
          )}
        </div>
      </div>
    </Layout>
  );
}
