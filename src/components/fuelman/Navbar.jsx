 import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, Home, FileText, Clock } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin keluar?")) {
      localStorage.clear();
      navigate("/login");
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm font-sans">
      {/* Mengubah max-w-7xl menjadi max-w-[98%] agar logo ke kiri dan logout ke kanan */}
      <div className="max-w-[98%] mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          
          {/* A. LOGO SECTION - Tergeser ke kiri karena kontainer meluas */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/Home')}>
            <img
              src="https://nbw.co.id/wp-content/uploads/2023/01/nbw.png"
              alt="Logo NBW"
              className="h-9 w-auto object-contain"
            />
            <div className="hidden md:flex flex-col justify-center">
               <span className="text-sm font-black text-gray-900 leading-tight tracking-tight">
                 PT NUSA BHAKTI WIRATAMA
               </span>
               <span className="text-[10px] font-bold text-red-600 uppercase tracking-[0.2em]">
                 BBM System
               </span>
            </div>
          </div>

          {/* B. MENU TENGAH */}
          <div className="flex items-center gap-1 h-full">
            <NavItem to="/Home" icon={<Home size={18} />} label="Home" />
            <NavItem to="/FormInputPemakaianFuel" icon={<FileText size={18} />} label="Form Pemakaian BBM" />
            <NavItem to="/Riwayat" icon={<Clock size={18} />} label="Riwayat" />
          </div>

          {/* C. TOMBOL LOGOUT - Tergeser ke kanan karena kontainer meluas */}
          <div className="flex items-center pl-4 border-l border-gray-200">
            <button 
              onClick={handleLogout}
              className="group flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-500 bg-gray-50 hover:bg-red-50 hover:text-red-600 rounded-full transition-all duration-300"
              title="Keluar"
            >
              <span className="hidden md:inline">Keluar</span>
              <LogOut size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}

function NavItem({ to, icon, label }) {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => `
        relative flex items-center gap-2 px-4 h-full text-sm transition-all duration-300 group
        ${isActive 
          ? "text-red-600 font-bold" 
          : "text-gray-500 hover:text-red-600 font-medium" 
        }
      `}
    >
      {({ isActive }) => (
        <>
          <span className="transition-colors duration-300">
            {icon}
          </span>
          <span className="hidden sm:inline">{label}</span>

          {/* INDIKATOR GARIS MERAH DI BAWAH */}
          <div 
            className={`
              absolute -bottom-[1px] left-0 right-0 h-1 bg-red-600 rounded-t-full 
              transition-all duration-300 transform origin-center 
              shadow-[0_-2px_4px_rgba(220,38,38,0.2)]
              ${isActive ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0 group-hover:scale-x-50 group-hover:opacity-50"}
            `}
          />
        </>
      )}
    </NavLink>
  );
}