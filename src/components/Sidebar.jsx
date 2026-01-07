 import React from "react"; 
import { RxDashboard } from "react-icons/rx";
import { FaPenAlt } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { FaGasPump } from "react-icons/fa";

export default function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  // --- KONFIGURASI MENU ---
  const NAV_ITEMS = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: <RxDashboard size={20} />, 
      isActive: (path) => path === "/" || path === "/dashboard",
    },
    {
      label: "Laporan Pemakaian BBM",
      path: "/PemakaianBBM",
      icon: <FaGasPump size={20} />,
      isActive: (path) => 
        path === "/PemakaianBBM" || 
        path === "/PemakaianBBMForm" || 
        path.startsWith("/laporan/"),
    },
  ];

  return (
    <aside
      className="flex flex-col min-h-screen w-64 bg-white border-r border-gray-200 sticky top-0 h-screen overflow-y-auto font-sans"
    >
      {/* --- LOGO SECTION (KEMBALI KE GAMBAR) --- */}
      <div className="pt-8 pb-6 px-6 text-center">
        <div className="flex items-center justify-center mb-6">
          <img
            src="https://nbw.co.id/wp-content/uploads/2023/01/nbw.png"
            alt="Logo NBW"
            className="h-12 w-auto object-contain hover:scale-105 transition-transform duration-300"
          />
        </div>
        {/* Garis Pemisah Halus */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      </div>

      {/* --- NAVIGATION MENU --- */}
      <nav className="flex-1 px-3 space-y-2 mt-2">
        <p className="px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
          Menu Utama
        </p>
        
        {NAV_ITEMS.map((item, index) => {
          const active = item.isActive(currentPath);

          return (
            <Link
              key={index}
              to={item.path}
              // Style Menu: Rapi, ada jarak kiri kanan (mx-3)
              className={`
                relative flex items-center gap-3 px-4 py-3 mx-3 rounded-lg text-sm transition-all duration-200 group
                ${
                  active
                    ? "bg-red-600 text-white font-bold shadow-md shadow-red-200" // Aktif: Merah Solid
                    : "text-gray-600 hover:bg-red-50 hover:text-red-600 font-medium" // Tidak Aktif
                }
              `}
            >
              {/* Icon */}
              <span className={`transition-colors ${active ? "text-white" : "text-gray-400 group-hover:text-red-500"}`}>
                {item.icon}
              </span>

              {/* Label */}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* --- FOOTER --- */}
      <div className="p-4 mt-auto">
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 text-center">
          <p className="text-xs text-gray-700 font-bold">Monit BBM System</p>
          <p className="text-[10px] text-gray-400">© 2025 Transport Div</p>
        </div>
      </div>
    </aside>
  );
}