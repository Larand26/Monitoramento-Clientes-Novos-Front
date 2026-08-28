import Layout from "../components/Layout";

export default function Clients() {
  return (
    <Layout page="clients" title="Clientes" subtitle="Lista de clientes">
      <div className="flex flex-col align-center gap-4 w-full mt-10">
        <div className="flex flex-wrap gap-10 justify-center overflow-y-auto max-h-[calc(100vh-300px)] custom-scrollbar"></div>
      </div>
    </Layout>
  );
}
