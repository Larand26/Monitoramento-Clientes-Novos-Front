import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as utils from "../utils/utils";

import Layout from "../components/Layout";
import CardClient from "../components/CardClient";
import { getClients } from "../apis/clients";
import type { Client } from "../interfaces/client.interface";

export default function Home() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchClients = async () => {
      setIsLoading(true);
      try {
        const updatedStart = new Date();
        const updatedEnd = new Date();
        updatedStart.setDate(updatedStart.getDate() - 30);

        const response = await getClients({
          updated_start: utils.dateToISOString(updatedStart),
          updated_end: utils.dateToISOString(updatedEnd),
        });

        if (isMounted) {
          setClients(response.data || []);
        }
      } catch (error) {
        console.error("Erro ao buscar clientes em destaque:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchClients();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Layout
      page="home"
      title="Clientes em Destaque"
      subtitle="Monitoramento de consumo e status dos últimos 30 dias"
    >
      <div className="flex flex-col align-center gap-4 w-full mt-10">
        {isLoading ? (
          <div className="w-full flex justify-center items-center mt-10">
            <p className="text-muted text-lg animate-pulse">
              Carregando clientes...
            </p>
          </div>
        ) : clients.length > 0 ? (
          <div className="flex flex-wrap gap-10 justify-center overflow-y-auto max-h-[calc(100vh-300px)] custom-scrollbar">
            {clients.map((client) => (
              <CardClient
                key={client._id}
                client={client}
                onClick={() => navigate("/dashboards", { state: { client } })}
              />
            ))}
          </div>
        ) : (
          <div className="w-full flex justify-center items-center mt-10">
            <p className="text-muted text-lg">
              Nenhum cliente atualizado nos últimos 30 dias.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
