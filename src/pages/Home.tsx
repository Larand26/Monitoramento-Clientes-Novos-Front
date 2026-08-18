import NavBar from "../components/NavBar";

export function Home() {
  return (
    <div>
      <NavBar />
      <h1 className="text-2xl font-bold text-slate-800">Início</h1>
      <p className="text-slate-600 mt-2">
        Bem-vindo ao sistema de monitoramento.
      </p>
    </div>
  );
}
