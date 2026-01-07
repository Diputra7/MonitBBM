//  import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { User, UserCog, Lock, Eye, EyeOff } from "lucide-react"; 

// export default function Login() {
//   const navigate = useNavigate();
  
//   // --- STATE DATA ---
//   const [role, setRole] = useState("fuelman"); // Default Fuelman
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
  
//   // --- STATE TAMPILAN ---
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   // --- FUNGSI LOGIN KE SERVER ---
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       // 1. KIRIM DATA KE BACKEND
//       const response = await fetch("http://localhost:3001/api/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ 
//           username: username, 
//           password: password, 
//           role: role 
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         // 2. JIKA LOGIN BERHASIL
//         localStorage.setItem("user_role", data.role);
//         localStorage.setItem("user_name", data.username);

//         // Arahkan ke halaman sesuai Role
//         if (data.role === "admin") {
//           navigate("/dashboard"); 
//         } else {
//           navigate("/home"); 
//         }
//       } else {
//         // 3. JIKA GAGAL
//         alert(data.message || "Login Gagal! Periksa Email dan Password Anda.");
//       }

//     } catch (error) {
//       console.error("Login Error:", error);
//       alert("Gagal terhubung ke Server. Pastikan Backend (node server.js) sudah jalan!");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Fungsi Reset Form saat ganti Tab
//   const switchRole = (newRole) => {
//     setRole(newRole);
//     setUsername(""); 
//     setPassword("");
//   };

//   return (
//     <div className="w-full max-w-md mx-auto animate-fade-in font-sans flex flex-col justify-center min-h-[80vh]">
      
//       {/* --- CARD FORM --- */}
//       <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-xl relative overflow-hidden">
        
//         {/* Dekorasi Cahaya Latar (MERAH UNTUK SEMUA) */}
//         <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full blur-[80px] opacity-20 bg-red-500 transition-all duration-500"></div>
//         <div className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full blur-[80px] opacity-20 bg-red-500 transition-all duration-500"></div>

//         {/* --- HEADER --- */}
//         <div className="relative z-10 text-center mb-6">
//           <h2 className="text-3xl font-extrabold text-gray-900 tracking-wider">
//             LOGIN
//           </h2>
//           <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-semibold">
//             Monit BBM System
//           </p>
//         </div>

//         {/* --- ROLE SWITCHER (TABS) --- */}
//         <div className="flex p-1 bg-gray-100 rounded-xl mb-6 relative border border-gray-200">
          
//           {/* 1. Tombol Fuelman */}
//           <button
//             type="button"
//             onClick={() => switchRole("fuelman")}
//             className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 relative z-10
//               ${role === "fuelman" 
//                 ? "bg-white text-red-600 shadow-sm border border-gray-200" 
//                 : "text-gray-400 hover:text-gray-600 hover:bg-gray-200"}`}
//           >
//             <User size={16} className={role === "fuelman" ? "text-red-500" : ""} /> Fuelman
//           </button>

//           {/* 2. Tombol Admin */}
//           <button
//             type="button"
//             onClick={() => switchRole("admin")}
//             className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 relative z-10 
//               ${role === "admin" 
//                 ? "bg-white text-red-600 shadow-sm border border-gray-200" 
//                 : "text-gray-400 hover:text-gray-600 hover:bg-gray-200"}`}
//           >
//             <UserCog size={16} className={role === "admin" ? "text-red-500" : ""} /> Admin
//           </button>

//         </div>

//         {/* --- FORM INPUT --- */}
//         <form className="space-y-5 relative z-10" onSubmit={handleLogin}>
          
//           {/* Email / Username */}
//           <div className="space-y-1.5">
//             <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
//               {role === 'admin' ? 'Email Admin' : 'Email Fuelman'}
//             </label>
//             <div className="relative group">
//               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                 <User size={18} className="text-gray-400 group-focus-within:text-red-500 transition-colors" />
//               </div>
//               <input
//                 type="text" 
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 placeholder={role === 'admin' ? "Masukkan Email" : "Masukkan Email"}
//                 required
//                 className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 
//                            text-gray-900 placeholder-gray-400 font-medium
//                            focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:bg-white 
//                            outline-none transition-all duration-200 shadow-sm"
//               />
//             </div>
//           </div>

//           {/* Password */}
//           <div className="space-y-1.5">
//             <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
//               Password
//             </label>
//             <div className="relative group">
//               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                 <Lock size={18} className="text-gray-400 group-focus-within:text-red-500 transition-colors" />
//               </div>
//               <input
//                 type={showPassword ? "text" : "password"}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="••••••••"
//                 required
//                 className="w-full pl-11 pr-12 py-3 rounded-xl border border-gray-200 bg-gray-50 
//                            text-gray-900 placeholder-gray-400 font-medium
//                            focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:bg-white 
//                            outline-none transition-all duration-200 shadow-sm"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer focus:outline-none"
//               >
//                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>
//           </div>

//           {/* Submit Button (MERAH GRADIENT UNTUK KEDUANYA) */}
//           <button
//             type="submit"
//             disabled={isLoading}
//             className={`
//               w-full py-3.5 rounded-xl font-bold text-white shadow-lg transform transition-all duration-300 mt-4
//               flex items-center justify-center gap-2 relative overflow-hidden group
//               bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 shadow-red-200
//               ${isLoading ? 'opacity-70 cursor-not-allowed pointer-events-none' : ''}
//             `}
//           >
//             <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></span>
            
//             {isLoading ? (
//               <>
//                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                 <span className="animate-pulse">Memproses...</span>
//               </>
//             ) : (
//               <span className="tracking-wide uppercase text-sm">
//                 Masuk Sekarang
//               </span>
//             )}
//           </button>

//         </form>
//       </div>
//     </div>
//   );
// }


// ===== NO DB =====

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, UserCog, Lock, Eye, EyeOff } from "lucide-react"; 

export default function Login() {
  const navigate = useNavigate();
  
  // --- STATE DATA ---
  const [role, setRole] = useState("fuelman"); // Default Fuelman
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  // --- STATE TAMPILAN ---
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // --- FUNGSI LOGIN SEMENTARA (TANPA DATABASE/SERVER) ---
  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulasi delay proses login 1 detik agar terasa natural
    setTimeout(() => {
      let isSuccess = false;
      let userData = {};

      // 1. VALIDASI MANUAL ROLE ADMIN
      if (role === "admin") {
        if (username === "admin@gmail.com" && password === "admin123") {
          isSuccess = true;
          userData = { username: "Administrator", role: "admin" };
        }
      } 
      // 2. VALIDASI MANUAL ROLE FUELMAN
      else {
        if (username === "fuelman@gmail.com" && password === "fuelman123") {
          isSuccess = true;
          userData = { username: "Petugas Fuelman", role: "fuelman" };
        }
      }

      if (isSuccess) {
        // Simpan ke LocalStorage agar sistem otentikasi aplikasi tetap jalan
        localStorage.setItem("user_role", userData.role);
        localStorage.setItem("user_name", userData.username);

        // Arahkan ke halaman sesuai Role
        if (userData.role === "admin") {
          navigate("/dashboard"); 
        } else {
          navigate("/home"); 
        }
      } else {
        alert(`Login Gagal! Akun ${role} tidak ditemukan atau password salah.`);
      }

      setIsLoading(false);
    }, 1000);
  };

  // Fungsi Reset Form saat ganti Tab
  const switchRole = (newRole) => {
    setRole(newRole);
    setUsername(""); 
    setPassword("");
  };

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in font-sans flex flex-col justify-center min-h-[80vh]">
      
      {/* --- CARD FORM --- */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-xl relative overflow-hidden">
        
        {/* Dekorasi Cahaya Latar (MERAH UNTUK SEMUA) */}
        <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full blur-[80px] opacity-20 bg-red-500 transition-all duration-500"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full blur-[80px] opacity-20 bg-red-500 transition-all duration-500"></div>

        {/* --- HEADER --- */}
        <div className="relative z-10 text-center mb-6">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-wider">
            LOGIN
          </h2>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-semibold">
            Monit BBM System
          </p>
        </div>

        {/* --- ROLE SWITCHER (TABS) --- */}
        <div className="flex p-1 bg-gray-100 rounded-xl mb-6 relative border border-gray-200">
          
          {/* 1. Tombol Fuelman */}
          <button
            type="button"
            onClick={() => switchRole("fuelman")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 relative z-10
              ${role === "fuelman" 
                ? "bg-white text-red-600 shadow-sm border border-gray-200" 
                : "text-gray-400 hover:text-gray-600 hover:bg-gray-200"}`}
          >
            <User size={16} className={role === "fuelman" ? "text-red-500" : ""} /> Fuelman
          </button>

          {/* 2. Tombol Admin */}
          <button
            type="button"
            onClick={() => switchRole("admin")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 relative z-10 
              ${role === "admin" 
                ? "bg-white text-red-600 shadow-sm border border-gray-200" 
                : "text-gray-400 hover:text-gray-600 hover:bg-gray-200"}`}
          >
            <UserCog size={16} className={role === "admin" ? "text-red-500" : ""} /> Admin
          </button>

        </div>

        {/* --- FORM INPUT --- */}
        <form className="space-y-5 relative z-10" onSubmit={handleLogin}>
          
          {/* Email / Username */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
              {role === 'admin' ? 'Email Admin' : 'Email Fuelman'}
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User size={18} className="text-gray-400 group-focus-within:text-red-500 transition-colors" />
              </div>
              <input
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={role === 'admin' ? "Masukkan Email" : "Masukkan Email"}
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 
                           text-gray-900 placeholder-gray-400 font-medium
                           focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:bg-white 
                           outline-none transition-all duration-200 shadow-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400 group-focus-within:text-red-500 transition-colors" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-11 pr-12 py-3 rounded-xl border border-gray-200 bg-gray-50 
                           text-gray-900 placeholder-gray-400 font-medium
                           focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:bg-white 
                           outline-none transition-all duration-200 shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button (MERAH GRADIENT UNTUK KEDUANYA) */}
          <button
            type="submit"
            disabled={isLoading}
            className={`
              w-full py-3.5 rounded-xl font-bold text-white shadow-lg transform transition-all duration-300 mt-4
              flex items-center justify-center gap-2 relative overflow-hidden group
              bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 shadow-red-200
              ${isLoading ? 'opacity-70 cursor-not-allowed pointer-events-none' : ''}
            `}
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></span>
            
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span className="animate-pulse">Memproses...</span>
              </>
            ) : (
              <span className="tracking-wide uppercase text-sm">
                Masuk Sekarang
              </span>
            )}
          </button>

        </form>
      </div>
      
      {/* Keterangan Akun Sementara (Untuk Testing) */}
   

    </div>
  );
}