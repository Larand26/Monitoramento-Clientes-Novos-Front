import Layout from "../components/Layout";
import InputSearchClients from "../components/InputSearchClients";

export default function Dashboards() {
  // Mock de dados para exemplificar a tipagem e o mapeamento
  const mockClients = [
    { name: "Empresa Alpha" },
    { name: "Tech Solutions" },
    { name: "Comércio Beta" },
  ];

  return (
    <Layout page="dashboards">
      {/* Container relative para o input flutuar perfeitamente */}
      <div className="relative w-full h-full flex justify-center">
        <InputSearchClients data={mockClients} />
      </div>
    </Layout>
  );
}
