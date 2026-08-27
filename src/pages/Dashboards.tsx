import { useState } from "react";

import Layout from "../components/Layout";
import InputSearchClients from "../components/InputSearchClients";

import type { Client } from "../interfaces/client.interface";

export default function Dashboards() {
  const [clients, setClients] = useState<Client[]>([]);
  return (
    <Layout page="dashboards">
      <div className="relative w-full h-full flex justify-center">
        <InputSearchClients data={clients} />
      </div>
    </Layout>
  );
}
