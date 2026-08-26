import Layout from "../components/Layout";
import CardClient from "../components/CardClient";

import type { Client } from "../interfaces/client.interface";

export default function Home() {
  const client = {
    _id: "fsdfsdfsdfsd",
    magento_id: "13774",
    rd_station_id: "fdfsdfdsfefsdfdsvs",
    name: "SANCHES CLINICA MEDICA LTDA",
    cnpj: "12345678901234",
    magento_order_ids: [],
    store_order_ids: ["187170"],
    status: "SUCCESS",
    created_at: "2026-08-12T22:46:35.000Z",
    updated_at: "2026-08-13T19:45:40.704Z",
    projected_profit: 0,
  } as Client;

  return (
    <Layout page="home">
      <CardClient client={client} />
    </Layout>
  );
}
