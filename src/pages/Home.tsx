import { useState, useEffect } from "react";

import Layout from "../components/Layout";
import CardClient from "../components/CardClient";

import { getClients } from "../apis/clients";

import type { Client } from "../interfaces/client.interface";

export default function Home() {
  const [clients, setClients] = useState<Client[]>();

  useEffect(() => {
    const fetchClients = async () => {
      const response = await getClients({});
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
        <div className="flex flex-wrap gap-10 justify-center">
          {clients?.map((client) => (
            <CardClient key={client._id} client={client} />
          ))}
        </div>
      </div>
    </Layout>
  );
}
