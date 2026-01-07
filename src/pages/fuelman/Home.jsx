 import { Link } from "react-router-dom";
import { FaArrowRight, FaGasPump } from "react-icons/fa";

export default function Home() {
  return (
    // 1. BACKGROUND: Warna dasar #b91c1c dipertahankan, tapi dipadukan dengan gradient ke arah merah yang lebih gelap (#7f1d1d) agar terlihat lebih tebal/pekat
    <div className="relative min-h-screen font-sans overflow-hidden bg-[#b91c1c] bg-gradient-to-br from-[#b91c1c] via-[#991b1b] to-[#7f1d1d] flex flex-col items-center justify-center text-white">
      
      {/* 2. GRADIENT OVERLAY: Dibuat sedikit lebih gelap di sisi kiri bawah agar warna merah terasa lebih solid dan berdimensi */}
      <div className="absolute inset-0 bg-black/10 z-0"></div>

      {/* 3. DEKORASI LATAR: NOISE TEXTURE */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay z-1"
        style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      ></div>
      
      {/* Ornamen Cahaya: Dibuat lebih kontras dengan warna merah pekat di belakangnya */}
      <div className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-white/5 rounded-full blur-[130px] opacity-30"></div>
      <div className="absolute -bottom-20 -left-20 w-[600px] h-[600px] bg-black/20 rounded-full blur-[100px] opacity-50"></div>

      {/* 4. CONTENT */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 animate-fade-in max-w-5xl mx-auto">
        
        {/* Logo / Ikon Brand */}
        <div className="mb-10 p-6 bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl rounded-3xl animate-bounce-slow">
           <FaGasPump className="text-5xl text-white" />
        </div>

        {/* Teks Judul */}
        <div className="mb-8 space-y-4">
          <p className="text-white/80 font-medium tracking-[0.4em] text-xs md:text-sm uppercase">
            PT Nusa Bhakti Wiratama
          </p>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none">
            FUELMAN <span className="text-white/70 font-light">DASHBOARD</span>
          </h1>
        </div>

        {/* Deskripsi */}
        <p className="text-white/80 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed font-light italic">
          "Monitoring dan pencatatan <span className="font-semibold text-white">Bahan Bakar Unit</span> secara digital, akurat, dan terintegrasi dalam satu ekosistem operasional."
        </p>

        {/* TOMBOL */}
        <div className="flex flex-col md:flex-row gap-5 w-full md:w-auto px-4 md:px-0 font-semibold">
          
          {/* Tombol Utama */}
          <Link
            to="/FormInputPemakaianFuel" 
            className="group flex items-center justify-center gap-3 px-12 py-4 bg-white text-[#991b1b] rounded-2xl text-lg shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-white/10 w-full md:w-auto"
          >
            <span>Mulai Input</span>
            <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
          </Link>

          {/* Tombol Sekunder */}
          <Link 
            to="/riwayat" 
            className="flex items-center justify-center px-12 py-4 bg-white/5 text-white border border-white/20 backdrop-blur-md rounded-2xl text-lg transition-all duration-300 w-full md:w-auto hover:bg-white/10 hover:border-white/40"
          >
             Riwayat Laporan
          </Link>
          
        </div>
      </div>
    </div>
  );
}