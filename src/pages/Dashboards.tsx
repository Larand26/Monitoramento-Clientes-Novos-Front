import { useState } from "react";

import Layout from "../components/Layout";
import InputSearchClients from "../components/InputSearchClients";

import type { Client } from "../interfaces/client.interface";

import { getClients } from "../apis/clients";
import * as utils from "../utils/utils";

export default function Dashboards() {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async () => {
    try {
      let responseCnpj: Client[];
      let responseName: Client[];
      let responseStoreId: Client[];

      if (searchQuery) {
        // Search by CNPJ
        responseCnpj = (
          await getClients({ cnpj: utils.formatCnpjforApi(searchQuery) })
        ).data;
        if (responseCnpj.length > 0) {
          setClients(responseCnpj);
          return;
        }
        // Search by Name
        responseName = (await getClients({ name: searchQuery })).data;
        if (responseName.length > 0) {
          setClients(responseName);
          return;
        }

        // Search by Store ID
        responseStoreId = (await getClients({ store_id: searchQuery })).data;
        if (responseStoreId.length > 0) {
          setClients(responseStoreId);
          return;
        }
      }
    } catch (error) {
      console.error("Error searching clients:", error);
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
        />
      </div>
    </Layout>
  );
}
