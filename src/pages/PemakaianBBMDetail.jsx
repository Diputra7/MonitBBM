 import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Edit,
  Save,
  X,
  Calendar,
  Clock,
  Users,
  User,
  Fuel,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function PemakaianBBMDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- STATE ---
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [search, setSearch] = useState("");

  // Pagination State - DIUBAH MENJADI 15 AGAR TIDAK TERPOTONG
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Data State
  const [header, setHeader] = useState({
    tanggal: "",
    shift: "",
    crew: "",
    supervisor: "",
  });
  const [rows, setRows] = useState([]);

  // --- 1. FETCH DATA ---
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/laporan/${id}`);
      const result = await response.json();

      if (response.ok) {
        setHeader(result.header);
        setRows(result.details);
      } else {
        console.error("Error:", result.error);
      }
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  // --- 2. HANDLER EDIT ROW ---
  const handleRowChange = (indexInFullRows, field, value) => {
    const newRows = [...rows];
    newRows[indexInFullRows] = { ...newRows[indexInFullRows], [field]: value };

    const row = newRows[indexInFullRows];

    const kmA = row.km_awal !== "" && row.km_awal !== "-" ? parseFloat(row.km_awal) : null;
    const kmB = row.km_akhir !== "" && row.km_akhir !== "-" ? parseFloat(row.km_akhir) : null;
    const sldA = row.saldo_awal !== "" && row.saldo_awal !== "-" ? parseFloat(row.saldo_awal) : null;
    const sldB = row.saldo_akhir !== "" && row.saldo_akhir !== "-" ? parseFloat(row.saldo_akhir) : null;

    const totalKm = (kmA !== null && kmB !== null) ? kmB - kmA : "-";
    const totalBbmCm = (sldA !== null && sldB !== null) ? (sldA - sldB).toFixed(1) : "-";
    
    let jumlahBbmLiter = "-";
    let rasio = "-";

    if (totalBbmCm !== "-") {
      const literVal = parseFloat(totalBbmCm) * 5;
      jumlahBbmLiter = literVal.toFixed(1);
      
      if (totalKm !== "-" && literVal !== 0) {
        rasio = (totalKm / literVal).toFixed(2);
      } else if (parseFloat(literVal) === 0 && totalKm !== "-") {
        rasio = "0.00";
      }
    }

    newRows[indexInFullRows].total_km = totalKm;
    newRows[indexInFullRows].total_bbm_terpakai = totalBbmCm;
    newRows[indexInFullRows].jumlah_bbm_terpakai = jumlahBbmLiter;
    newRows[indexInFullRows].rasio = rasio;

    setRows(newRows);
  };

  // --- 3. SIMPAN ---
  const handleSave = async () => {
    if (!window.confirm("Simpan perubahan pada tabel unit?")) return;

    const grandTotal = rows.reduce((sum, item) => {
      const val = parseFloat(item.jumlah_bbm_terpakai);
      return sum + (isNaN(val) ? 0 : val);
    }, 0);

    const payload = {
      ...header,
      total_bbm_terpakai: grandTotal,
      details: rows,
    };

    try {
      const response = await fetch(`http://localhost:3001/api/laporan/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Data unit berhasil diperbarui!");
        setIsEditing(false);
        fetchData();
      } else {
        const errData = await response.json();
        alert("Gagal update: " + errData.error);
      }
    } catch (error) {
      console.error("Error saving:", error);
      alert("Terjadi kesalahan koneksi server");
    }
  };

  // --- 4. FORMATTER ---
  const formatDateDisplay = (isoString) => {
    if (!isoString) return "-";
    const d = new Date(isoString);
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // --- 5. LOGIC FILTER & PAGINATION ---
  const filteredRows = rows.filter((d) =>
    d.unit.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRows.slice(indexOfFirstItem, indexOfLastItem);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans text-gray-800 pb-20 p-6">
      <div className="max-w-full mx-auto mb-8 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-red-50 text-red-600 p-2.5 rounded-full hover:bg-red-100 transition-colors shadow-sm"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-red-600 tracking-tight flex items-center gap-3">
            Detail Pemakaian BBM
            {isEditing && (
              <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full border border-yellow-200 uppercase tracking-wider font-bold">
                Mode Edit
              </span>
            )}
          </h1>
          <p className="text-sm text-gray-500 font-medium">Laporan Harian Operasional Unit</p>
        </div>
      </div>

      <div className="max-w-full mx-auto space-y-6">
        {/* INFO CARD */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-red-600"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 ml-2">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-gray-400 font-bold uppercase flex items-center gap-1.5"><Calendar size={12} /> TANGGAL</span>
              <span className="text-lg font-bold text-gray-900">{formatDateDisplay(header.tanggal)}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-gray-400 font-bold uppercase flex items-center gap-1.5"><Clock size={12} /> SHIFT</span>
              <span className="text-lg font-bold text-gray-900">{header.shift}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-gray-400 font-bold uppercase flex items-center gap-1.5"><Users size={12} /> CREW</span>
              <span className="text-lg font-bold text-gray-900">{header.crew}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-gray-400 font-bold uppercase flex items-center gap-1.5"><User size={12} /> SUPERVISOR</span>
              <span className="text-lg font-bold text-gray-900">{header.supervisor}</span>
            </div>
          </div>
        </div>

        {/* TABEL DETAIL */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/30">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2 min-w-max">
                <Fuel className="text-red-600" size={18} /> Data Unit
              </h2>
              <div className="relative group w-32 md:w-40">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input
                  type="text"
                  placeholder="Cari Unit..."
                  maxLength={2}
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-8 pr-3 py-1.5 bg-white border border-gray-300 rounded-lg text-[11px] outline-none focus:ring-1 focus:ring-red-500 w-full transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <span className="text-[10px] font-bold text-gray-500 bg-white px-3 py-1.5 rounded border border-gray-200 shadow-sm">
                Total: {filteredRows.length} Unit
              </span>
              {isEditing ? (
                <>
                  <button onClick={() => { setIsEditing(false); fetchData(); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-bold text-xs transition-all"><X size={14} /> Batal</button>
                  <button onClick={handleSave} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-md font-bold text-xs transition-all"><Save size={14} /> Simpan</button>
                </>
              ) : (
                <button onClick={() => setIsEditing(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-sm font-bold text-xs transition-all"><Edit size={14} /> Edit Data</button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead className="bg-[#b91c1c] text-white uppercase font-bold text-[11px] tracking-wider shadow-sm">
                <tr>
                  <th className="px-4 py-4 sticky left-0 z-20 bg-[#b91c1c] border-r border-white/10 shadow-md">Unit</th>
                  <th className="px-3 py-4 border-r border-white/10 text-center">Operator</th>
                  <th className="px-3 py-4 border-r border-white/10 text-center">Lokasi</th>
                  <th className="px-2 py-4 text-center border-r border-white/10">KM Awal</th>
                  <th className="px-2 py-4 text-center border-r border-white/10">Saldo Awal</th>
                  <th className="px-2 py-4 text-center border-r border-white/10">KM Akhir</th>
                  <th className="px-2 py-4 text-center border-r border-white/10">Saldo Akhir</th>
                  <th className="px-2 py-4 text-center border-r border-white/10 bg-red-800/20">Total KM</th>
                  <th className="px-2 py-4 text-center border-r border-white/10 bg-red-800/20">Total BBM (Cm)</th>
                  <th className="px-2 py-4 text-center border-r border-white/10 bg-red-800/20">Total BBM (L)</th>
                  <th className="px-2 py-4 text-center border-r border-white/10">Rasio</th>
                  <th className="px-4 py-4 text-center">Keterangan</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100 font-medium text-gray-700">
                {currentItems.length > 0 ? (
                  currentItems.map((d, i) => {
                    const realIndex = indexOfFirstItem + i;
                    
                    const clean = (val) => {
                      if (val === null || val === undefined || val === "" || val === "-" || val.toString() === "NaN") {
                        return "-";
                      }
                      return val;
                    };

                    return (
                      <tr key={i} className="hover:bg-red-50/20 transition-colors odd:bg-white even:bg-gray-50/40">
                        <td className="px-4 py-3.5 font-bold text-[#1e293b] sticky left-0 z-10 bg-white border-r border-gray-100">{d.unit}</td>
                        <td className="px-2 py-3.5 border-r border-gray-100 text-center">
                          {isEditing ? <input type="text" className="w-24 border border-gray-300 rounded px-2 py-1 text-center font-medium" value={d.operator} onChange={(e) => handleRowChange(realIndex, "operator", e.target.value)} /> : clean(d.operator)}
                        </td>
                        <td className="px-2 py-3.5 border-r border-gray-100 text-center">
                          {isEditing ? <input type="text" className="w-20 border border-gray-300 rounded px-2 py-1 text-center font-medium" value={d.lokasi} onChange={(e) => handleRowChange(realIndex, "lokasi", e.target.value)} /> : clean(d.lokasi)}
                        </td>
                        <td className="px-2 py-3.5 text-center border-r border-gray-100">
                          {isEditing ? <input type="number" className="w-16 border border-gray-300 rounded px-1 py-1 text-center font-medium" value={d.km_awal} onChange={(e) => handleRowChange(realIndex, "km_awal", e.target.value)} /> : clean(d.km_awal)}
                        </td>
                        <td className="px-2 py-3.5 text-center border-r border-gray-100 font-bold text-gray-900">
                          {isEditing ? <input type="text" className="w-16 border border-gray-300 rounded px-1 py-1 text-center font-bold" value={d.saldo_awal} onChange={(e) => handleRowChange(realIndex, "saldo_awal", e.target.value)} /> : clean(d.saldo_awal)}
                        </td>
                        <td className="px-2 py-3.5 text-center border-r border-gray-100">
                          {isEditing ? <input type="number" className="w-16 border border-gray-300 rounded px-1 py-1 text-center font-medium" value={d.km_akhir} onChange={(e) => handleRowChange(realIndex, "km_akhir", e.target.value)} /> : clean(d.km_akhir)}
                        </td>
                        <td className="px-2 py-3.5 text-center border-r border-gray-100 font-bold text-gray-900">
                          {isEditing ? <input type="text" className="w-16 border border-gray-300 rounded px-1 py-1 text-center font-bold" value={d.saldo_akhir} onChange={(e) => handleRowChange(realIndex, "saldo_akhir", e.target.value)} /> : clean(d.saldo_akhir)}
                        </td>
                        <td className="px-2 py-3.5 text-center font-bold text-gray-800 bg-red-50/20 border-r border-gray-100">{clean(d.total_km)}</td>
                        <td className="px-2 py-3.5 text-center font-bold text-gray-800 bg-red-50/20 border-r border-gray-100">{clean(d.total_bbm_terpakai)}</td>
                        <td className="px-2 py-3.5 text-center font-bold text-red-600 bg-red-50/20 border-r border-gray-100">{clean(d.jumlah_bbm_terpakai)}</td>
                        <td className="px-2 py-3.5 text-center font-bold text-gray-800 bg-red-50/20 border-r border-gray-100">{clean(d.rasio)}</td>
                        <td className="px-4 py-3.5 text-center">
                          {isEditing ? <input type="text" className="w-32 border border-gray-300 rounded px-2 py-1 text-xs font-medium" value={d.keterangan} onChange={(e) => handleRowChange(realIndex, "keterangan", e.target.value)} /> : <span className="italic text-gray-500 font-normal">{clean(d.keterangan)}</span>}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr><td colSpan="12" className="p-8 text-center text-gray-400 italic font-normal">Unit tidak ditemukan.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}