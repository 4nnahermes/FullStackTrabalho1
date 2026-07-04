import { createRoot } from "react-dom/client";
import "./index.css";

import { BrowserRouter, Route, Routes } from "react-router";

import App from "./App";
import Home from "./components/Home";
import ListaClientes from "./components/clientes/ListaClientes";
import ListaPets from "./components/pets/ListaPets";
import ListaVeterinarios from "./components/veterinarios/ListaVeterinarios";
import FormCliente from "./components/clientes/FormCliente";
import FormPet from "./components/pets/FormPet";
import FormVeterinario from "./components/veterinarios/FormVeterinario";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="/clientes" element={<ListaClientes />} />
        <Route path="/clientes/novo" element={<FormCliente />} />
        <Route path="/clientes/editar/:id" element={<FormCliente />} />
        <Route path="/pets" element={<ListaPets />} />
        <Route path="/pets/novo" element={<FormPet />} />
        <Route path="/veterinarios" element={<ListaVeterinarios />} />
        <Route path="/pets/editar/:id" element={<FormPet />} />
        <Route path="/veterinarios/novo" element={<FormVeterinario />} />
        <Route path="/veterinarios/editar/:id" element={<FormVeterinario />} />
      </Route>
    </Routes>
  </BrowserRouter>
);