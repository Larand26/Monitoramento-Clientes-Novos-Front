import { useState, useEffect } from "react";

import Layout from "../components/Layout";
import InputSearchClients from "../components/InputSearchClients";

import type { Client } from "../interfaces/client.interface";

import { getHistory } from "../apis/history";
import { getClients } from "../apis/clients";
import * as utils from "../utils/utils";

export default function Dashboards() {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

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

      // 1. Fazemos as buscas sequencialmente até encontrar algo
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

      // 2. Se encontrou clientes, atualiza o histórico
      if (foundClients.length > 0) {
        // Pega o histórico atual
        const currentHistory: Client[] = JSON.parse(
          localStorage.getItem("clients") || "[]",
        );

        // Remove os clientes encontrados do histórico atual para não duplicar, caso já existam
        const filteredHistory = currentHistory.filter(
          (historyItem) =>
            !foundClients.some(
              (newClient) => newClient._id === historyItem._id,
            ),
        );

        // Coloca os novos no topo e limita a, por exemplo, 10 itens recentes
        const newHistory = [...foundClients, ...filteredHistory].slice(0, 10);

        // Atualiza a tela com o histórico completo (para aparecer no dropdown)
        setClients(newHistory);

        // Salva fisicamente no navegador
        localStorage.setItem("clients", JSON.stringify(newHistory));
      }

      setSearchQuery("");
    } catch (error) {
      console.error("Error searching clients:", error);
    }
  };

  const handleGetHistoryClients = async (id: string) => {
    try {
      const history = await getHistory({
        id: id,
        id_type: "_id",
      });
      console.log("History:", history);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  return (
    <Layout page="dashboards">
      <div className="relative w-full h-full flex justify-center">
        <InputSearchClients
          data={clients}
          searchQuery={searchQuery}
          onchange={setSearchQuery}
          onSearch={handleSearch}
          onGetHistory={handleGetHistoryClients}
        />
      </div>
    </Layout>
  );
}
