import React from "react";
import { Navigate, Outlet } from "react-router-dom";

// Component ini menerima props "allowedRoles" (Role apa saja yang boleh masuk)
export default function ProtectedRoute({ allowedRoles }) {
  // 1. Ambil data dari LocalStorage (yang kita simpan saat Login tadi)
  const userRole = localStorage.getItem("user_role");
  const username = localStorage.getItem("user_name");

  // 2. Cek: Apakah user sudah login?
  // Kalau tidak ada role/username, tendang ke Login Page
  if (!userRole || !username) {
    return <Navigate to="/login" replace />;
  }

  // 3. Cek: Apakah Role user sesuai dengan yang diminta halaman ini?
  // Contoh: Halaman Admin butuh role "admin". Kalau user rolenya "fuelman", dia ditolak.
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    
    // Jika salah kamar, kembalikan ke halaman kandang masing-masing
    if (userRole === "admin") {
      return <Navigate to="/dashboard" replace />;
    } else {
      return <Navigate to="/home" replace />;
    }
  }

  // 4. Jika lolos semua pengecekan, silakan masuk (Render halaman aslinya)
  return <Outlet />;
}