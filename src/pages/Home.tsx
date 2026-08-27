import { useState, useEffect } from "react";
import * as utils from "../utils/utils";

import Layout from "../components/Layout";
import CardClient from "../components/CardClient";

import { getClients } from "../apis/clients";

import type { Client } from "../interfaces/client.interface";

export default function Home() {
  const [clients, setClients] = useState<Client[]>();

  useEffect(() => {
    const fetchClients = async () => {
      const updatedStart = new Date();
      const updatedEnd = new Date();
      updatedStart.setDate(updatedStart.getDate() - 30);
      const response = await getClients({
        updated_start: utils.dateToISOString(updatedStart),
        updated_end: utils.dateToISOString(updatedEnd),
      });
      console.log("Fetched clients:", response.data);
      setClients(response.data);
    };
    fetchClients();
  }, []);

  return (
    <Layout
      page="home"
      title="Clientes em Destaque"
      subtitle="Monitoramento de consumo e status dos últimos 30 dias"
    >
      <div className="flex flex-col align-center gap-4 w-full mt-10">
        <div className="flex flex-wrap gap-10 justify-center overflow-y-auto max-h-[calc(100vh-300px)] custom-scrollbar">
          {clients?.map((client) => (
            <CardClient key={client._id} client={client} />
          ))}
        </div>
      </div>
    </Layout>
  );
}
