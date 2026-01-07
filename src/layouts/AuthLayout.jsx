 import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  // URL Gambar Pilihan Anda
  const bgImage = "https://img.freepik.com/foto-premium/elevator-biji-bijian-dengan-peralatan-mekanis-untuk-menerima-membersihkan-mengeringkan-pengiriman-biji-bijian_1048944-5530836.jpg";

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gray-900">
      
      {/* 1. BACKGROUND IMAGE */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url('${bgImage}')` 
        }}
      ></div>

      {/* 2. OVERLAY GRADIENT */}
      {/* Menggelapkan gambar agar Login Card lebih menonjol dan teks terbaca */}
      {/* Gradasi: Abu Gelap -> Merah Gelap Transparan */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-gray-900/95 via-gray-900/80 to-red-900/50 mix-blend-multiply"></div>

      {/* 3. KONTEN UTAMA (Outlet Login) */}
      <div className="relative z-10 w-full max-w-md px-4 py-8">
        <Outlet />
      </div>

      {/* 4. DEKORASI BAWAH (Fade ke Hitam di kaki halaman) */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-900 to-transparent z-0"></div>
    </div>
  );
}