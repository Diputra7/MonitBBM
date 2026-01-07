 import React from "react";

export default function Footer() {
  return (
    // mt-auto memastikan footer selalu di paling bawah jika konten sedikit
    <footer className="w-full bg-white border-t border-gray-100 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-2 text-center md:text-left">
        
        {/* Kiri: Copyright */}
        <p className="text-xs text-gray-500 font-medium">
          &copy; {new Date().getFullYear()} <span className="text-gray-900 font-bold">PT Nusa Bhakti Wiratama</span>.
        </p>

        {/* Kanan: Versi Aplikasi (Opsional) */}
        <div className="flex items-center gap-4">
          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
             BBM System v1.0
          </span>
        </div>

      </div>
    </footer>
  );
}