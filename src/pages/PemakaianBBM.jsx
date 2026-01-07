 import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Trash2, Plus, Filter, FileText, Calendar, Clock, Users, User, Printer, ChevronLeft, ChevronRight } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function PemakaianBBM() {
  const navigate = useNavigate();

  // --- STATE ---
  const [dataLaporan, setDataLaporan] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPrinting, setIsPrinting] = useState(false);
  
  // Filter & Pagination
  const [query, setQuery] = useState("");
  const [filterShift, setFilterShift] = useState("All");
  const [filterMonth, setFilterMonth] = useState("All"); // State Baru untuk Bulan
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 

  const months = [
    { val: "All", label: "Semua Bulan" },
    { val: "0", label: "Januari" },
    { val: "1", label: "Februari" },
    { val: "2", label: "Maret" },
    { val: "3", label: "April" },
    { val: "4", label: "Mei" },
    { val: "5", label: "Juni" },
    { val: "6", label: "Juli" },
    { val: "7", label: "Agustus" },
    { val: "8", label: "September" },
    { val: "9", label: "Oktober" },
    { val: "10", label: "November" },
    { val: "11", label: "Desember" },
  ];

  // --- 1. FETCH DATA ---
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/laporan');
      const result = await response.json();
      if (result.data) {
        // PERBAIKAN LOGIKA SORTING: TANGGAL TERLAMA KE TERBARU (ASCENDING)
        const sorted = result.data.sort((a, b) => {
            if (a.tanggal !== b.tanggal) {
                // Urutkan dari tanggal terkecil (A ke B)
                return new Date(a.tanggal) - new Date(b.tanggal);
            }
            // Jika tanggal sama, urutkan shift (Pagi dulu baru Malam)
            return a.shift === "Pagi" ? -1 : 1;
        });
        setDataLaporan(sorted);
      }
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- 2. HAPUS LAPORAN ---
  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus laporan ini?")) {
      try {
        await fetch(`http://localhost:3001/api/laporan/${id}`, { method: 'DELETE' });
        fetchData();
      } catch (error) {
        console.error("Gagal menghapus:", error);
      }
    }
  };

  // --- 3. PRINT PDF HARIAN ---
  const handlePrintDailyPDF = async (targetDate) => {
    setIsPrinting(true);
    try {
        const reportsOnDate = dataLaporan.filter(d => d.tanggal === targetDate);
        reportsOnDate.sort((a, b) => (a.shift === 'Pagi' ? -1 : 1));

        if (reportsOnDate.length === 0) return;

        const promises = reportsOnDate.map(report => 
            fetch(`http://localhost:3001/api/laporan/${report.id}`).then(res => res.json())
        );

        const allReportsData = await Promise.all(promises);
        const doc = new jsPDF();
        const displayDate = new Date(targetDate).toLocaleDateString('id-ID', { 
            day: '2-digit', month: 'long', year: 'numeric' 
        });

        doc.setFontSize(18);
        doc.setTextColor(220, 38, 38);
        doc.setFont("helvetica", "bold");
        doc.text(`Laporan Harian Pemakaian BBM`, 14, 15);
        
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.setFont("helvetica", "normal");
        doc.text(`PT Nusa Bhakti Wiratama`, 14, 20);
        
        doc.setDrawColor(200);
        doc.line(14, 23, 196, 23);

        doc.setFontSize(11);
        doc.setTextColor(0);
        doc.text(`Tanggal: ${displayDate}`, 14, 30);

        let finalY = 35; 

        allReportsData.forEach((data) => {
            const { header, details } = data;

            if (finalY > 250) {
                doc.addPage();
                finalY = 20;
            }

            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            doc.setFillColor(245, 245, 245);
            doc.rect(14, finalY, 182, 8, 'F'); 
            doc.text(`SHIFT: ${header.shift.toUpperCase()}  |  CREW: ${header.crew}  |  SPV: ${header.supervisor}`, 16, finalY + 5.5);
            
            finalY += 9;

            const tableRows = details.map(row => [
                row.unit,
                row.operator,
                row.lokasi,
                row.km_awal,
                row.km_akhir,
                row.total_km,
                row.jumlah_bbm_terpakai,
                row.rasio ? parseFloat(row.rasio).toFixed(2) : "0",
                row.keterangan
            ]);

            autoTable(doc, {
                head: [["Unit", "Operator", "Lokasi", "KM Awal", "KM Akhir", "Total KM", "BBM (L)", "Rasio", "Ket"]],
                body: tableRows,
                startY: finalY,
                theme: 'grid',
                headStyles: { fillColor: [220, 38, 38], textColor: 255, fontSize: 8, fontStyle: 'bold' },
                styles: { fontSize: 7, cellPadding: 2, textColor: 50 },
                columnStyles: { 0: { fontStyle: 'bold' } },
                didDrawPage: (data) => { finalY = data.cursor.y; }
            });

            finalY = doc.lastAutoTable.finalY + 10;
        });

        doc.save(`Laporan_BBM_${displayDate}.pdf`);

    } catch (error) {
        console.error("Gagal cetak PDF:", error);
        alert("Gagal membuat PDF.");
    } finally {
        setIsPrinting(false);
    }
  };

  // --- 4. FORMAT TANGGAL ---
  const formatDate = (iso) => {
    if (!iso) return "-";
    const d = new Date(iso);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = String(d.getFullYear()).slice(2);
    return `${day}/${month}/${year}`;
  };

  // --- 5. FILTER & PAGINATION ---
  const filtered = dataLaporan.filter((d) => {
    const searchLower = query.toLowerCase();
    const dateObj = new Date(d.tanggal);
    
    const matchSearch =
      (d.tanggal && d.tanggal.includes(query)) ||
      (d.shift && d.shift.toLowerCase().includes(searchLower)) ||
      (d.supervisor && d.supervisor.toLowerCase().includes(searchLower));
    
    const matchShift = filterShift === "All" || d.shift === filterShift;
    
    const matchMonth = filterMonth === "All" || dateObj.getMonth().toString() === filterMonth;

    return matchSearch && matchShift && matchMonth;
  });

  // Grouping Data
  const groupedData = filtered.reduce((acc, item) => {
    if (!acc[item.tanggal]) acc[item.tanggal] = [];
    acc[item.tanggal].push(item);
    return acc;
  }, {});

  // Pagination Logic
  const dateKeys = Object.keys(groupedData);
  const totalPages = Math.ceil(dateKeys.length / itemsPerPage);
  const indexOfLastDate = currentPage * itemsPerPage;
  const indexOfFirstDate = indexOfLastDate - itemsPerPage;
  const currentDateKeys = dateKeys.slice(indexOfFirstDate, indexOfLastDate);

  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  return (
    <div className="w-full min-h-screen bg-gray-50/50 font-sans text-gray-800 p-6 pb-20">
      
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <FileText className="text-red-600" size={24} />
            Monitoring Pemakaian BBM
          </h1>
          <p className="text-gray-500 text-xs mt-1 ml-8">
            Daftar laporan harian pemakaian bahan bakar unit.
          </p>
        </div>
      </div>

      {/* FILTER CARD */}
      <div className="max-w-7xl mx-auto bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" size={18} />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Cari berdasarkan tanggal / supervisor..."
              className="pl-10 pr-4 py-2.5 w-full bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:bg-white transition-all"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            {/* Filter Shift */}
            <div className="relative w-full md:w-40">
                <Filter className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" size={16} />
                <select
                value={filterShift}
                onChange={(e) => { setFilterShift(e.target.value); setCurrentPage(1); }}
                className="pl-10 pr-8 py-2.5 w-full bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-red-500 cursor-pointer appearance-none font-medium"
                >
                <option value="All">Semua Shift</option>
                <option value="Pagi">Shift Pagi</option>
                <option value="Malam">Shift Malam</option>
                </select>
            </div>

            {/* Filter Bulan */}
            <div className="relative w-full md:w-44">
                <Calendar className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" size={16} />
                <select
                value={filterMonth}
                onChange={(e) => { setFilterMonth(e.target.value); setCurrentPage(1); }}
                className="pl-10 pr-8 py-2.5 w-full bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-red-500 cursor-pointer appearance-none font-medium"
                >
                {months.map((m) => (
                    <option key={m.val} value={m.val}>{m.label}</option>
                ))}
                </select>
            </div>
          </div>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="px-6 py-3 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider text-normal">
                Total Laporan: <span className="text-red-600 font-bold">{filtered.length}</span>
            </span>
        </div>

        <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-sm">
            <thead className="bg-gradient-to-r from-red-700 to-red-600 text-white border-b border-red-800 uppercase font-bold text-[11px] tracking-wider shadow-sm">
                <tr>
                <th className="px-6 py-4 w-40 border-r border-red-500/50">Tanggal</th>
                <th className="px-6 py-4 border-r border-red-500/50 font-medium text-normal">Shift</th>
                <th className="px-6 py-4 border-r border-red-500/50 font-medium text-normal">Crew</th>
                <th className="px-6 py-4 border-r border-red-500/50 font-medium text-normal">Supervisor</th>
                <th className="px-6 py-4 text-center border-r border-red-500/50 font-medium text-normal">Detail Data</th>
                <th className="px-6 py-4 text-center font-medium text-normal">Aksi</th>
                </tr>
            </thead>

            <tbody className="text-gray-700 bg-white divide-y divide-gray-100">
                {isLoading ? (
                <tr>
                    <td colSpan="6" className="py-12 text-center text-gray-400">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-6 h-6 border-2 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
                            <span>Memuat data...</span>
                        </div>
                    </td>
                </tr>
                ) : currentDateKeys.length > 0 ? (
                currentDateKeys.map(dateKey => {
                    const items = groupedData[dateKey];
                    return items.map((item, index) => (
                    <tr key={item.id} className="hover:bg-red-50/30 transition-colors group font-normal">
                        {index === 0 && (
                        <td
                            rowSpan={items.length}
                            className="px-6 py-4 border-r border-gray-100 align-top bg-gray-50/30"
                        >
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-2 font-bold text-gray-800">
                                    <Calendar size={14} className="text-red-500"/>
                                    {formatDate(dateKey)}
                                </div>
                                <button 
                                    onClick={() => handlePrintDailyPDF(item.tanggal)}
                                    disabled={isPrinting}
                                    className={`
                                        flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all shadow-sm w-max
                                        ${isPrinting 
                                            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-wait" 
                                            : "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                                        }
                                    `}
                                >
                                    {isPrinting ? (
                                        <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <Printer size={12} /> 
                                    )}
                                    {isPrinting ? "Proses..." : "Unduh Laporan"}
                                </button>
                            </div>
                        </td>
                        )}

                        <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                                <Clock size={14} className="text-gray-400"/>
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${item.shift === 'Pagi' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {item.shift}
                                </span>
                            </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-600">
                            <div className="flex items-center gap-2">
                                <Users size={14} className="text-gray-400"/>
                                Crew {item.crew}
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                                <User size={14} className="text-gray-400"/>
                                {item.supervisor}
                            </div>
                        </td>

                        <td className="px-6 py-4 text-center">
                            <button
                                onClick={() => navigate(`/laporan/${item.id}`)}
                                className="text-red-600 hover:text-red-800 font-semibold text-xs border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded transition-all"
                            >
                                Lihat Detail →
                            </button>
                        </td>

                        <td className="px-6 py-4 text-center">
                            <button 
                                onClick={() => handleDelete(item.id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Hapus Laporan"
                            >
                                <Trash2 size={18} />
                            </button>
                        </td>
                    </tr>
                    ));
                })
                ) : (
                <tr>
                    <td colSpan="6" className="py-12 text-center text-gray-400 italic">
                        Tidak ada data laporan ditemukan.
                    </td>
                </tr>
                )}
            </tbody>
            </table>
        </div>

        {/* PAGINATION CONTROLS */}
        {dateKeys.length > 0 && (
            <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium">
                    Menampilkan {indexOfFirstDate + 1} - {Math.min(indexOfLastDate, dateKeys.length)} dari {dateKeys.length} Tanggal
                </span>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={prevPage} 
                        disabled={currentPage === 1}
                        className={`p-2 rounded-lg border transition-all ${currentPage === 1 ? 'border-gray-100 text-gray-300 cursor-not-allowed' : 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-red-600 shadow-sm'}`}
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <div className="px-4 py-1.5 bg-red-50 text-red-700 rounded-lg text-xs font-bold border border-red-100">
                        Hal. {currentPage} / {totalPages}
                    </div>
                    <button 
                        onClick={nextPage} 
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-lg border transition-all ${currentPage === totalPages ? 'border-gray-100 text-gray-300 cursor-not-allowed' : 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-red-600 shadow-sm'}`}
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}