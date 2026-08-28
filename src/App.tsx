import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Dashboards from "./pages/Dashboards";
import Clients from "./pages/Clients";
import Login from "./pages/Login";

import { useAppStore } from "./store/useAppStore";

import "./styles/app.css";

export default function App() {
  const initializeAppData = useAppStore((state) => state.initializeAppData);
  const isAppReady = useAppStore((state) => state.isAppReady);

  useEffect(() => {
    initializeAppData();
  }, [initializeAppData]);

  if (!isAppReady) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center">
        <span className="text-muted font-title tracking-widest animate-pulse">
          INICIANDO SISTEMA...
        </span>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route>
          <Route path="/home" element={<Home />} />
          <Route path="/dashboards" element={<Dashboards />} />
          <Route path="/clients" element={<Clients />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
