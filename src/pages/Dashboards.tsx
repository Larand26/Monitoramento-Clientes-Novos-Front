import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import Layout from "../components/Layout";
import InputSearchClients from "../components/InputSearchClients";
import HistoryChart, { type ChartData } from "../components/HistoryChart";

import type { Client } from "../interfaces/client.interface";

import { getOrders } from "../apis/orders";
import { getClients } from "../apis/clients";
import * as utils from "../utils/utils";
import { processOrderData } from "../utils/dashboardLogic";

export default function Dashboards() {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  const location = useLocation();

  useEffect(() => {
    if (location.state?.client) {
      handleGetClientOrders(location.state.client);
    }
  }, [location.state?.client]);

  useEffect(() => {
    const storedClients = localStorage.getItem("clients");
    if (storedClients) {
      setClients(JSON.parse(storedClients));
    }
  }, []);

  const handleSearch = async () => {
    try {
      if (!searchQuery) return;

      let foundClients: Client[] = [];

      const responseName = (await getClients({ name: searchQuery })).data;
      if (responseName.length > 0) {
        foundClients = responseName;
      } else {
        const responseCnpj = (
          await getClients({ cnpj: utils.formatCnpjforApi(searchQuery) })
        ).data;
        if (responseCnpj.length > 0) {
          foundClients = responseCnpj;
        } else {
          const responseStoreId = (await getClients({ store_id: searchQuery }))
            .data;
          if (responseStoreId.length > 0) {
            foundClients = responseStoreId;
          }
        }
      }

      if (foundClients.length > 0) {
        const currentHistory: Client[] = JSON.parse(
          localStorage.getItem("clients") || "[]",
        );

        const filteredHistory = currentHistory.filter(
          (historyItem) =>
            !foundClients.some(
              (newClient) => newClient._id === historyItem._id,
            ),
        );

        const newHistory = [...foundClients, ...filteredHistory].slice(0, 10);
        setClients(newHistory);
        localStorage.setItem("clients", JSON.stringify(newHistory));
      }

      setSearchQuery("");
    } catch (error) {
      console.error("Error searching clients:", error);
    }
  };

  const handleGetClientOrders = async (client: Client) => {
    try {
      const response = await getOrders({
        client_id: client._id,
        limit: 1000,
      });

      const finalData = processOrderData(response.data);

      setChartData(finalData);
      setSelectedClient(client);
    } catch (error) {
      console.error("Error fetching orders:", error);
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
          onGetHistory={handleGetClientOrders}
          isClientSelected={!!selectedClient}
        />

        <div
          className={`flex-1 w-full mt-20 transition-all duration-1000 ease-in-out ${
            selectedClient && chartData.length > 0
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10 pointer-events-none absolute"
          }`}
        >
          <HistoryChart data={chartData} />
        </div>
      </div>
    </Layout>
  );
}
