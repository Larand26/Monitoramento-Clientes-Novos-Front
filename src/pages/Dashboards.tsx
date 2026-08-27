import { useState, useEffect } from "react";

import Layout from "../components/Layout";
import InputSearchClients from "../components/InputSearchClients";
import HistoryChart, { type ChartData } from "../components/HistoryChart";

import type { Client } from "../interfaces/client.interface";

import { getHistory } from "../apis/history";
import { getClients } from "../apis/clients";
import * as utils from "../utils/utils";

export default function Dashboards() {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [historyData, setHistoryData] = useState<ChartData[]>([]);

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

  const handleGetHistoryClients = async (client: Client) => {
    try {
      const response = await getHistory({
        id: client._id,
        id_type: "_id",
      });

      // 1. Filtra pedidos duplicados verificando o order_id
      const uniqueOrders = response.data.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.order_id === item.order_id),
      );

      // 2. Formata os dados históricos da API
      const formattedData: ChartData[] = uniqueOrders.map((item) => ({
        ...item,
        formattedDate: new Date(item.changed_at).toLocaleDateString("pt-BR"),
      }));

      // 3. Define as datas âncora (Criação e Hoje)
      const today = new Date();
      const todayFormatted = today.toLocaleDateString("pt-BR");

      // Usamos (client as any) para contornar caso created_at não esteja explícito na sua interface Client
      const rawCreatedAt = (client as any).created_at
        ? new Date((client as any).created_at)
        : new Date();
      const createdAtFormatted = rawCreatedAt.toLocaleDateString("pt-BR");

      // 4. Monta o array final com os nós de início e fim (y = 0)
      const finalData: ChartData[] = [];

      // Ponto Inicial: Data de criação do cliente
      finalData.push({
        _id: "start_node",
        client_id: client._id,
        previous_status: "SUCCESS", // Passando strings válidas da interface
        new_status: "SUCCESS",
        order_value: 0, // y = 0
        changed_at: rawCreatedAt.toISOString(),
        order_id: "start_node",
        formattedDate: createdAtFormatted,
      });

      // Pontos do Meio: Histórico de compras
      finalData.push(...formattedData);

      // Ponto Final: Hoje (Apenas se a última compra não foi realizada exatamente hoje)
      const hasBoughtToday = formattedData.some(
        (item) => item.formattedDate === todayFormatted,
      );

      if (!hasBoughtToday) {
        finalData.push({
          _id: "end_node",
          client_id: client._id,
          previous_status: "SUCCESS",
          new_status: "SUCCESS",
          order_value: 0, // y = 0
          changed_at: today.toISOString(),
          order_id: "end_node",
          formattedDate: todayFormatted,
        });
      }

      // 5. Ordena cronologicamente para garantir que a linha do Recharts flua da esquerda para a direita
      finalData.sort(
        (a, b) =>
          new Date(a.changed_at).getTime() - new Date(b.changed_at).getTime(),
      );

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
          {/* O componente agora é chamado de forma limpa */}
          <HistoryChart data={historyData} />
        </div>
      </div>
    </Layout>
  );
}
