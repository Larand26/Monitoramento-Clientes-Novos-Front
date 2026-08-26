import Layout from "../components/Layout";

import { getClients } from "../apis/clients";

export default function Home() {
  const handleGetClients = async () => {
    try {
      const data = await getClients({ cnpj: "52902849000154" });
      console.log(data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  return (
    <Layout page="home">
      <>
        <button onClick={handleGetClients}>Buscar clientes</button>
      </>
    </Layout>
  );
}
