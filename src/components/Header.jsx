import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // nanti bisa ditambah clear token / session
    navigate("/");
  };

  return (
    <header
      className="flex items-center w-full h-16 bg-white px-6 border-b border-gray-200"
      style={{ fontFamily: "var(--font-Manrope-semibold)" }}
    >
      {/* Left Greeting */}
      <div className="hidden md:flex flex-col flex-shrink-0 mr-6">
        <p className="text-sm font-semibold text-gray-800 tracking-wide">
          BBM MONITORING
        </p>
        <p className="text-xs text-gray-400">PT NUSA BHAKTI WIRATAMA</p>
      </div>

      {/* Right Area */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Profile Section (Administrator Text + Image) */}
        <div className="flex items-center gap-3 mr-2">
          {/* Teks Administrator */}
          <span className="text-sm font-bold text-gray-700">Admin</span>

          {/* Foto Profil */}
          <img
            src="https://png.pngtree.com/png-vector/20190710/ourlarge/pngtree-user-vector-avatar-png-image_1541962.jpg"
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border shadow-sm"
          />
        </div>

        {/* Separator Kecil (Opsional, agar rapi) */}
        <div className="h-6 w-[1px] bg-gray-300 mx-1"></div>

        {/* Logout Icon */}
        <button
          onClick={handleLogout}
          title="Logout"
          className="p-2 rounded-lg text-gray-500 hover:text-red-600 
                     hover:bg-red-50 transition"
        >
          <FaSignOutAlt className="text-lg" />
        </button>
      </div>
    </header>
  );
}
