import Layout from "../components/Layout";
import InputSearchClients from "../components/InputSearchClients";

export default function Dashboards() {
  return (
    <Layout page="dashboards">
      <div className="flex flex-col items-center justify-center h-full py-2">
        <h1 className="text-4xl font-title text-main mb-4">
          Pesquise o cliente desejado
        </h1>
        <InputSearchClients />
      </div>
    </Layout>
  );
}
