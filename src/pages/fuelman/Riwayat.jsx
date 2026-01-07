 import React, { useState, useEffect } from "react";
import {
  Search,
  Calendar,
  Clock,
  Users,
  User,
  Fuel,
  ChevronDown,
  ChevronUp,
  FileText,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RiwayatFuelmanExpandable() {
  const navigate = useNavigate();
  const [dataLaporan, setDataLaporan] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterShift, setFilterShift] = useState("All");
  const [filterMonth, setFilterMonth] = useState("All");
  const [expandedId, setExpandedId] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // --- STATE PAGINATION ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3001/api/laporan");
      const result = await response.json();
      if (result.data) {
        const sorted = result.data.sort((a, b) => b.id - a.id);
        setDataLaporan(sorted);
      }
    } catch (error) {
      console.error("Gagal ambil data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDateShort = (isoString) => {
    if (!isoString) return "-";
    const d = new Date(isoString);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = String(d.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  const toggleExpand = async (id) => {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(id);
    setDetailLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/laporan/${id}`);
      const result = await response.json();
      if (response.ok) {
        setDataLaporan((prevData) =>
          prevData.map((item) =>
            item.id === id ? { ...item, details: result.details } : item
          )
        );
      }
    } catch (error) {
      console.error("Gagal ambil detail:", error);
    } finally {
      setDetailLoading(false);
    }
  };

  const filteredData = dataLaporan.filter((item) => {
    const itemDate = new Date(item.tanggal);
    const itemMonth = itemDate.getMonth() + 1;
    const matchSearch =
      item.tanggal.includes(searchQuery) ||
      item.supervisor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchShift = filterShift === "All" || item.shift === filterShift;
    const matchMonth =
      filterMonth === "All" || itemMonth === parseInt(filterMonth);
    return matchSearch && matchShift && matchMonth;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    setExpandedId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-6 font-sans text-gray-800 animate-fade-in">
      
      {/* 1. HEADER HALAMAN (DIUBAH AGAR SELARAS DENGAN INPUT FORM) */}
      <div className="max-w-6xl mx-auto mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="pt-2 border-b-2 border-red-600 w-fit pb-1">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight uppercase">
              Riwayat Pengisian BBM
            </h1>
          </div>
          <p className="text-gray-500 text-xs mt-1 italic font-normal">
            Daftar arsip digital laporan harian pemakaian bahan bakar unit.
          </p>
        </div>
      </div>

      {/* 2. FILTER CARD (TETAP) */}
      <div className="max-w-6xl mx-auto bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-red-600"></div>
        <div className="flex flex-col md:flex-row gap-4 items-center pl-2">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari berdasarkan tanggal / supervisor..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm text-gray-600 placeholder-gray-400 focus:bg-white focus:ring-1 focus:ring-red-500 outline-none transition-all"
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <select
                className="pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 outline-none focus:ring-1 focus:ring-red-500 cursor-pointer appearance-none min-w-[140px]"
                onChange={(e) => {
                  setFilterShift(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="All">Semua Shift</option>
                <option value="Pagi">Pagi</option>
                <option value="Malam">Malam</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <select
                value={filterMonth}
                className="pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 outline-none focus:ring-1 focus:ring-red-500 cursor-pointer appearance-none min-w-[140px]"
                onChange={(e) => {
                  setFilterMonth(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="All">Semua Bulan</option>
                {["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"].map((m, i) => (
                  <option key={i} value={i + 1}>{m}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
            </div>
          </div>
        </div>
      </div>

      {/* 3. LIST LAPORAN (TETAP) */}
      <div className="max-w-6xl mx-auto space-y-4">
        {isLoading ? (
          <div className="py-20 text-center bg-white rounded-xl border border-gray-200 font-normal">Memuat riwayat...</div>
        ) : (
          currentItems.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden transition-all">
              <div
                onClick={() => toggleExpand(item.id)}
                className={`px-5 py-4 cursor-pointer flex items-center justify-between hover:bg-red-50/30 transition-colors ${expandedId === item.id ? "bg-red-50/40" : ""}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-lg ${item.shift === "Pagi" ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"}`}>
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-none mb-1 font-normal">{formatDateShort(item.tanggal)}</p>
                    <p className="text-gray-900 text-sm md:text-base font-bold tracking-tight">Shift {item.shift} — Crew {item.crew}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="hidden md:inline text-[10px] font-bold text-red-600 uppercase tracking-widest font-normal">{expandedId === item.id ? "Tutup Detail" : "Lihat Detail"}</span>
                  {expandedId === item.id ? <ChevronUp className="text-red-600" /> : <ChevronDown className="text-gray-400" />}
                </div>
              </div>

              {expandedId === item.id && (
                <div className="border-t border-red-100 bg-white animate-fade-in p-4">
                  <div className="mb-3 px-2 flex items-center gap-4">
                    <span className="text-xs font-bold text-gray-600 uppercase flex items-center gap-1">
                      <User size={14} className="text-red-600" /> Supervisor : <span className="text-gray-900">{item.supervisor}</span>
                    </span>
                  </div>

                  <div className="overflow-x-auto rounded-lg border border-gray-100">
                    <table className="w-full text-left border-collapse table-fixed min-w-[800px]">
                      <thead className="bg-[#b91c1c] text-white uppercase font-bold text-[11px]">
                        <tr>
                          <th className="px-2 py-4 w-24 border-r border-white/10 text-center">Unit</th>
                          <th className="px-2 py-4 w-32 border-r border-white/10 text-center">Operator</th>
                          <th className="px-2 py-4 w-24 border-r border-white/10 text-center">Lokasi</th>
                          <th className="px-1 py-4 w-20 border-r border-white/10 text-center">KM Awal</th>
                          <th className="px-1 py-4 w-20 border-r border-white/10 text-center">Saldo Awal</th>
                          <th className="px-1 py-4 w-20 border-r border-white/10 text-center">KM Akhir</th>
                          <th className="px-1 py-4 w-20 border-r border-white/10 text-center">Saldo Akhir</th>
                          <th className="px-2 py-4 w-40 text-center">Keterangan</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm divide-y divide-gray-100 font-medium text-gray-700 bg-white">
                        {detailLoading && !item.details ? (
                          <tr><td colSpan="8" className="py-4 text-center italic text-gray-400 font-normal">Mengambil data...</td></tr>
                        ) : (
                          item.details?.map((unit, idx) => (
                            <tr key={idx} className="hover:bg-red-50/20 transition-colors">
                              <td className="px-2 py-3 font-bold text-[#1e293b] text-center border-r border-gray-100 bg-gray-50/30">{unit.unit}</td>
                              <td className="px-2 py-3 text-center border-r border-gray-100">{unit.operator || "-"}</td>
                              <td className="px-2 py-3 text-center border-r border-gray-100">{unit.lokasi || "-"}</td>
                              <td className="px-1 py-3 text-center border-r border-gray-100">{unit.km_awal}</td>
                              <td className="px-1 py-3 text-center border-r border-gray-100 text-gray-900 font-bold bg-red-50/10">{unit.saldo_awal}</td>
                              <td className="px-1 py-3 text-center border-r border-gray-100">{unit.km_akhir}</td>
                              <td className="px-1 py-3 text-center border-r border-gray-100 text-gray-900 font-bold bg-red-50/10">{unit.saldo_akhir}</td>
                              <td className="px-2 py-3 text-center italic text-gray-500 font-normal">{unit.keterangan || "-"}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* 4. PAGINATION (TETAP) */}
      {!isLoading && totalPages > 1 && (
        <div className="max-w-6xl mx-auto mt-10 flex items-center justify-center gap-2 pb-10">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-all shadow-sm ${currentPage === 1 ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed" : "bg-white text-gray-600 border-gray-200 hover:bg-red-50"}`}
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              const isActive = currentPage === pageNum;
              return (
                <button
                  key={pageNum}
                  onClick={() => paginate(pageNum)}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-bold transition-all shadow-sm ${isActive ? "bg-red-600 text-white border-red-600 shadow-red-200" : "bg-white text-gray-600 border border-gray-200 hover:border-red-400 hover:text-red-600"}`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-all shadow-sm ${currentPage === totalPages ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed" : "bg-white text-gray-600 border-gray-200 hover:bg-red-50"}`}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}