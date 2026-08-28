import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Hook para capturar o estado da rota

import Layout from "../components/Layout";
import InputSearchClients from "../components/InputSearchClients";
import HistoryChart, { type ChartData } from "../components/HistoryChart";

import type { Client } from "../interfaces/client.interface";

import { getHistory } from "../apis/history";
import * as utils from "../utils/utils";
import { processHistoryData } from "../utils/dashboardLogic"; // Importa a lógica isolada

export default function Dashboards() {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [historyData, setHistoryData] = useState<ChartData[]>([]);

  const location = useLocation(); // Acessa os dados passados pelo navigate()

  // Auto-Load via Deep Link: Se recebeu um cliente pelo router state, aciona a busca na hora
  useEffect(() => {
    if (location.state?.client) {
      handleGetHistoryClients(location.state.client);
    }
    // Opcional: Você pode limpar o state usando window.history.replaceState se não
    // quiser que o gráfico recarregue caso a página sofra refresh manual.
  }, [location.state?.client]);

  useEffect(() => {
    const storedClients = localStorage.getItem("clients");
    if (storedClients) {
      setClients(JSON.parse(storedClients));
    }
  }, []);

  const handleSearch = async () => {
    // ... [Seu código original de busca sequencial permanece intacto aqui] ...
  };

  const handleGetHistoryClients = async (client: Client) => {
    try {
      const response = await getHistory({
        id: client._id,
        id_type: "_id",
      });

      // A mágica do Clean Code: Toda a formatação e injeção de nós está encapsulada!
      const finalData = processHistoryData(client, response.data);

      setHistoryData(finalData);
      setSelectedClient(client);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  return (
    <Layout page="dashboards">
      <div className="relative w-full h-full flex flex-col pt-2">
        <div
          className={`absolute top-0 left-0 transition-all duration-700 ease-in-out ${
            selectedClient
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
        >
          {selectedClient && (
            <h2 className="text-4xl font-title text-main uppercase">
              {utils.removeFirstsNubersFromName(selectedClient.name)}
            </h2>
          )}
        </div>

        <InputSearchClients
          data={clients}
          searchQuery={searchQuery}
          onchange={setSearchQuery}
          onSearch={handleSearch}
          onGetHistory={handleGetHistoryClients}
          isClientSelected={!!selectedClient}
        />

        <div
          className={`flex-1 w-full mt-20 transition-all duration-1000 ease-in-out ${
            selectedClient && historyData.length > 0
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10 pointer-events-none absolute"
          }`}
        >
          <HistoryChart data={historyData} />
        </div>
      </div>
    </Layout>
  );
}
