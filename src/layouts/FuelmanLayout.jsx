 import { Outlet } from "react-router-dom";
import Navbar from "../components/fuelman/Navbar";
import Footer from "../components/fuelman/Footer";

export default function FuelmanLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
