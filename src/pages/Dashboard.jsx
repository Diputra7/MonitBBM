 import React, { useState, useEffect, useMemo } from "react";
import { Activity, Droplet, TrendingUp, Calendar, AlertTriangle, CheckCircle, FileX } from "lucide-react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function Dashboard() {
  const [dataLaporan, setDataLaporan] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk filter bulan
  const [filterMonth, setFilterMonth] = useState("All");

  // --- 1. FETCH DATA ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/laporan');
      const result = await response.json();
      const baseData = Array.isArray(result) ? result : (result.data || []);

      const fullData = await Promise.all(
        baseData.map(async (report) => {
          try {
            const resDetail = await fetch(`http://localhost:3001/api/laporan/${report.id}`);
            const detailResult = await resDetail.json();
            return {
              ...report,
              details: detailResult.details || [] 
            };
          } catch (err) {
            return { ...report, details: [] };
          }
        })
      );

      setDataLaporan(fullData);
    } catch (error) {
      console.error("Gagal sinkronisasi dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- 2. LOGIKA KALKULASI DENGAN FILTER ---
  const stats = useMemo(() => {
    let bbmTotalAkumulasi = 0;
    let kmTotalAkumulasi = 0;
    let hemat = 0;
    let boros = 0;
    let unitsList = [];
    let chartObj = {};

    // Filter data berdasarkan bulan terpilih
    const filteredData = dataLaporan.filter(item => {
      if (filterMonth === "All") return true;
      const reportDate = new Date(item.tanggal);
      return (reportDate.getMonth() + 1) === parseInt(filterMonth);
    });

    filteredData.forEach(report => {
      let bbmPerLaporan = 0;

      if (report.details && report.details.length > 0) {
        report.details.forEach(u => {
          const sA = parseFloat(u.saldo_awal) || 0;
          const sB = parseFloat(u.saldo_akhir) || 0;
          const kA = parseFloat(u.km_awal) || 0;
          const kB = parseFloat(u.km_akhir) || 0;

          const selisihCm = sA - sB;
          const literUnit = selisihCm > 0 ? selisihCm * 5 : 0;
          const selisihKm = kB - kA;
          const kmUnit = selisihKm > 0 ? selisihKm : 0;

          bbmPerLaporan += literUnit;
          kmTotalAkumulasi += kmUnit;

          const rso = literUnit > 0 ? kmUnit / literUnit : 0;
          if (rso > 0) {
            unitsList.push({ ...u, calcRasio: rso });
            if (rso >= 3) hemat++;
            if (rso <= 1) boros++;
          }
        });
      }

      bbmTotalAkumulasi += bbmPerLaporan;
      const tgl = new Date(report.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
      chartObj[tgl] = (chartObj[tgl] || 0) + bbmPerLaporan;
    });

    const sortedLabels = Object.keys(chartObj).sort((a, b) => new Date(a) - new Date(b));
    const sortedValues = sortedLabels.map(l => chartObj[l]);
    const topBoros = unitsList.sort((a, b) => a.calcRasio - b.calcRasio).slice(0, 5);

    return { bbmTotalAkumulasi, kmTotalAkumulasi, hemat, boros, topBoros, labels: sortedLabels, values: sortedValues };
  }, [dataLaporan, filterMonth]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-red-600 font-bold">
      <div className="animate-spin w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full mb-4"></div>
      <p>Mengkalkulasi Seluruh Liter BBM...</p>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-gray-50/50 p-6 font-sans text-gray-800">
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Activity className="text-red-600" size={24} />
            Dashboard Monitoring
          </h1>
          <p className="text-gray-500 text-xs mt-1 ml-8 font-medium">
            Pantau rasio pemakaian per unit secara real-time.
          </p>
        </div>

        {/* Tampilan Search/Filter Bulan Sesuai Gambar */}
        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 flex items-center gap-3">
          <Calendar size={18} className="text-gray-400" />
          <select 
            value={filterMonth} 
            onChange={(e) => setFilterMonth(e.target.value)}
            className="bg-transparent text-sm font-semibold focus:outline-none cursor-pointer text-gray-700 pr-2"
          >
            <option value="All">Semua Bulan</option>
            <option value="1">Januari</option>
            <option value="2">Februari</option>
            <option value="3">Maret</option>
            <option value="4">April</option>
            <option value="5">Mei</option>
            <option value="6">Juni</option>
            <option value="7">Juli</option>
            <option value="8">Agustus</option>
            <option value="9">September</option>
            <option value="10">Oktober</option>
            <option value="11">November</option>
            <option value="12">Desember</option>
          </select>
        </div>
      </div>

      {/* KARTU STATISTIK */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Konsumsi" value={stats.bbmTotalAkumulasi} unit="Ltr" color="red" icon={<Droplet size={20}/>} />
        <StatCard title="Total Jarak" value={stats.kmTotalAkumulasi} unit="KM" color="blue" icon={<Activity size={20}/>} />
        <StatCard title="Target Hemat" value={stats.hemat} unit="Unit" color="green" icon={<CheckCircle size={20}/>} />
        <StatCard title="Kategori Boros" value={stats.boros} unit="Unit" color="orange" icon={<AlertTriangle size={20}/>} />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GRAFIK */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2 text-sm uppercase">
            <TrendingUp size={16} className="text-red-600"/> Tren Liter BBM Harian
          </h3>
          <div className="h-72">
            {stats.values.length > 0 ? (
              <Line 
                data={{
                  labels: stats.labels,
                  datasets: [{
                    label: 'Liter',
                    data: stats.values,
                    borderColor: '#dc2626',
                    backgroundColor: 'rgba(220, 38, 38, 0.05)',
                    fill: true, tension: 0.4, pointRadius: 5
                  }]
                }} 
                options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} 
              />
            ) : <div className="h-full flex items-center justify-center text-gray-400 italic font-medium">Data grafik kosong untuk bulan ini</div>}
          </div>
        </div>

        {/* RANKING TERBOROS */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-6 text-sm uppercase">Paling Boros (KM/L)</h3>
          <div className="space-y-3">
            {stats.topBoros.length > 0 ? stats.topBoros.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${item.calcRasio <= 1 ? 'bg-red-600 text-white' : 'bg-yellow-400 text-gray-900'}`}>
                    {idx + 1}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{item.unit}</p>
                    <p className="text-[10px] text-gray-400 uppercase font-medium">{item.operator || "No Name"}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-black ${item.calcRasio <= 1 ? 'text-red-600' : 'text-yellow-600'}`}>{item.calcRasio.toFixed(2)}</p>
                  <p className="text-[9px] text-gray-400 font-bold uppercase">KM/L</p>
                </div>
              </div>
            )) : (
              <div className="text-center py-10">
                <FileX size={32} className="mx-auto text-gray-200 mb-2" />
                <p className="text-xs text-gray-400 italic font-medium">Data unit tidak ditemukan</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, unit, color, icon }) {
  const colors = {
    red: "text-red-600 bg-red-50",
    blue: "text-blue-600 bg-blue-50",
    green: "text-green-600 bg-green-50",
    orange: "text-orange-600 bg-orange-50"
  };
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-start mb-2">
        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">{title}</p>
        <div className={`p-2 rounded-lg ${colors[color]}`}>{icon}</div>
      </div>
      <h3 className="text-2xl font-black">
        {typeof value === 'number' ? value.toLocaleString('id-ID', { maximumFractionDigits: 1 }) : value} 
        <span className="text-xs text-gray-400 font-bold ml-1">{unit}</span>
      </h3>
    </div>
  );
}