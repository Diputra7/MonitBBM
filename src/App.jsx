import "./assets/tailwind.css";
import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import PemakaianBBM from "./pages/PemakaianBBM";
import PemakaianBBMForm from "./pages/PemakaianBBMForm";
import PemakaianBBMDetail from "./pages/PemakaianBBMDetail";
import ExportLaporan from "./pages/ExportLaporan";

import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/auth/Login";

import FuelmanLayout from "./layouts/FuelmanLayout";
import Home from "./pages/fuelman/Home";  
import FormInputPemakaianFuel from "./pages/fuelman/FormInputPemakaianFuel";
import Riwayat from "./pages/fuelman/Riwayat";


function App() {
  return (
    <Routes>
      {/* Layout Utama */}
      <Route element={<MainLayout />}>
        {/* Halaman Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/PemakaianBBM" element={<PemakaianBBM />} />
        <Route
          path="/laporan/:id"
          element={<PemakaianBBMDetail />}
        />
        <Route path="/PemakaianBBMForm" element={<PemakaianBBMForm />} />
        <Route path="/ExportLaporan" element={<ExportLaporan />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/" element={<Login />} />
      </Route>

      <Route element={<FuelmanLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/FormInputPemakaianFuel" element={<FormInputPemakaianFuel />} />
         <Route path="/Riwayat" element={ <Riwayat />} />
      </Route>
    </Routes>
  );
}
export default App;
