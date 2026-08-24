import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboards from "./pages/Dashboards";
import Clients from "./pages/Clients";
import Login from "./pages/Login";

import "./styles/app.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route>
          <Route path="/" element={<Home />} />
          <Route path="/dashboards" element={<Dashboards />} />
          <Route path="/clients" element={<Clients />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
