 import React, { useState, useRef, useEffect } from 'react';
import { Save, Calendar, FileText, User, Users, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FuelEntryForm = () => {
    const navigate = useNavigate();
    const inputsRef = useRef({}); 

    // --- CONFIGURATION (TETAP) ---
    const COL_ORDER = ['operator', 'lokasi', 'km_awal', 'saldo_awal', 'km_akhir', 'saldo_akhir', 'keterangan'];
    const LOKASI_OPTIONS = ["Duri", "Minas", "Bangko", "Shop", "Standby", "SWA"];

    const initialHeader = {
      tanggal: '',
      shift: '',
      crew: '',
      supervisor: '',
    };

    const initialUnits = [
      "27x12231", "27x12232", "27x12233", "27x12234", "27x12235",
      "27x12236", "27x12237", "27x12238", "27x12239", "27x12240",
      "27x12241", "27x12242", "27x12243", "27x12244", "27x12245"
    ];

    const createEmptyRows = () => 
      initialUnits.map(unit => ({
        unit: unit,
        operator: '',
        lokasi: '',
        km_awal: '',
        saldo_awal: '',
        km_akhir: '',
        saldo_akhir: '',
        keterangan: ''
      }));

    // --- STATE ---
    const [headerData, setHeaderData] = useState(initialHeader);
    const [rows, setRows] = useState(createEmptyRows());
    const [isLoading, setIsLoading] = useState(false);
    const dateInputRef = useRef(null);

    // --- LOGIKA AUTO-PULL DATA PAGI KE MALAM (STRICT DATE) ---
    useEffect(() => {
        const pullMorningData = async () => {
            // Setiap ganti tanggal atau shift, reset dulu ke kosong agar tidak ada data nyangkut
            setRows(createEmptyRows());

            if (headerData.tanggal && headerData.shift === 'Malam') {
                try {
                    // Cari data shift pagi KHUSUS tanggal yang dipilih saja
                    const response = await fetch(`http://localhost:3001/api/laporan?tanggal=${headerData.tanggal}&shift=Pagi`);
                    const result = await response.json();

                    // Cek apakah ada data dan apakah tanggalnya benar-benar cocok
                    if (result.data && result.data.length > 0) {
                        const morningReport = result.data.find(item => item.tanggal.startsWith(headerData.tanggal));
                        
                        if (morningReport) {
                            const detailRes = await fetch(`http://localhost:3001/api/laporan/${morningReport.id}`);
                            const morningDetails = await detailRes.json();

                            if (morningDetails.details) {
                                const updatedRows = initialUnits.map(unit => {
                                    const morningUnit = morningDetails.details.find(d => d.unit === unit);
                                    return {
                                        unit: unit,
                                        operator: morningUnit?.operator || '',
                                        lokasi: morningUnit?.lokasi || '',
                                        km_awal: morningUnit?.km_akhir || '',
                                        saldo_awal: morningUnit?.saldo_akhir || '',
                                        km_akhir: '',
                                        saldo_akhir: '',
                                        keterangan: ''
                                    };
                                });
                                setRows(updatedRows);
                            }
                        }
                    }
                } catch (error) {
                    console.error("Gagal menarik data pagi:", error);
                }
            }
        };
        pullMorningData();
    }, [headerData.tanggal, headerData.shift]);


    // --- LOGIC HANDLERS ---
    const handleHeaderChange = (e) => {
      const { name, value } = e.target;
      if (name === 'crew') {
          let autoSupervisor = '';
          if (value === 'A') autoSupervisor = 'Sugianto - Efrizal';
          else if (value === 'B') autoSupervisor = 'Agus Salim - Halasan';
          else if (value === 'C') autoSupervisor = 'Firdaus - Chairul';
          setHeaderData(prev => ({ ...prev, crew: value, supervisor: autoSupervisor }));
      } else {
          setHeaderData(prev => ({ ...prev, [name]: value }));
      }
    };

    const handleRowChange = (index, field, value) => {
      const newRows = [...rows];
      let finalValue = value;

      if (field === 'saldo_awal' || field === 'saldo_akhir') {
          let cleaned = value.replace(/[^0-9.]/g, '');
          if (cleaned.includes('.') && cleaned.split('.').length > 2) {
              cleaned = cleaned.split('.')[0] + '.' + cleaned.split('.').slice(1).join('');
          }

          if (!cleaned.includes('.')) {
              if (cleaned.length >= 3) {
                  finalValue = `${cleaned.slice(0, 2)}.${cleaned.slice(2, 3)}`;
              } else {
                  finalValue = cleaned;
              }
          } else {
              const [depan, belakang] = cleaned.split('.');
              const limitedBelakang = belakang ? belakang.slice(0, 1) : '';
              finalValue = `${depan}.${limitedBelakang}`;
          }
      }

      newRows[index][field] = finalValue;
      setRows(newRows);
    };

    const handleCalendarClick = () => {
      if (dateInputRef.current) {
          if (dateInputRef.current.showPicker) dateInputRef.current.showPicker();
          else dateInputRef.current.focus(); 
      }
    };

    // --- FITUR NAVIGASI PANAH (KIRI, KANAN, ATAS, BAWAH) ---
    const handleKeyDown = (e, rowIndex, fieldName) => {
        const colIndex = COL_ORDER.indexOf(fieldName);
        let nextRow = rowIndex;
        let nextCol = colIndex;

        if (e.key === 'ArrowUp') {
            e.preventDefault();
            nextRow = Math.max(0, rowIndex - 1);
        } else if (e.key === 'ArrowDown' || e.key === 'Enter') {
            e.preventDefault();
            nextRow = Math.min(rows.length - 1, rowIndex + 1);
        } else if (e.key === 'ArrowLeft') {
            // Pindah kolom ke kiri jika bukan di awal
            if (colIndex > 0) {
                e.preventDefault();
                nextCol = colIndex - 1;
            }
        } else if (e.key === 'ArrowRight') {
            // Pindah kolom ke kanan jika bukan di akhir
            if (colIndex < COL_ORDER.length - 1) {
                e.preventDefault();
                nextCol = colIndex + 1;
            }
        } else {
            return; // Biarkan key lain bekerja normal
        }

        const nextInput = inputsRef.current[`${nextRow}-${COL_ORDER[nextCol]}`];
        if (nextInput) {
            nextInput.focus();
            if (nextInput.select && COL_ORDER[nextCol] !== 'lokasi') {
                setTimeout(() => nextInput.select(), 0);
            }
        }
    };

    const setInputRef = (el, rowIndex, fieldName) => {
      if (el) inputsRef.current[`${rowIndex}-${fieldName}`] = el;
    };

    const handleSubmit = async () => {
      if (!headerData.tanggal || !headerData.shift) {
        alert("Mohon lengkapi Tanggal dan Shift terlebih dahulu!");
        return;
      }
      setIsLoading(true);
      try {
        let grandTotalBBM = 0;
        const processedDetails = rows.map(row => {
          const kA = row.km_awal !== "" ? parseFloat(row.km_awal) : null;
          const kmB = row.km_akhir !== "" ? parseFloat(row.km_akhir) : null;
          const sldA = row.saldo_awal !== "" ? parseFloat(row.saldo_awal) : null;
          const sldB = row.saldo_akhir !== "" ? parseFloat(row.saldo_akhir) : null;

          let totalKm = "-";
          let totalBbmCm = "-";
          let bbmLiter = "-";
          let rasio = "-";

          if (kA !== null && kmB !== null) totalKm = kmB - kA;
          if (sldA !== null && sldB !== null) {
              totalBbmCm = (sldA - sldB).toFixed(1);
              const bbmLiterVal = (parseFloat(totalBbmCm) * 5);
              bbmLiter = bbmLiterVal.toFixed(1);
              if (bbmLiterVal > 0) grandTotalBBM += bbmLiterVal;
              if (totalKm !== "-" && bbmLiterVal !== 0) {
                  rasio = (totalKm / bbmLiterVal).toFixed(2);
              }
          }

          return {
            unit: row.unit,
            operator: row.operator.trim() === "" ? "-" : row.operator,
            lokasi: row.lokasi === "" ? "-" : row.lokasi,
            km_awal: row.km_awal === "" ? "-" : row.km_awal,
            saldo_awal: row.saldo_awal === "" ? "-" : row.saldo_awal,
            km_akhir: row.km_akhir === "" ? "-" : row.km_akhir,
            saldo_akhir: row.saldo_akhir === "" ? "-" : row.saldo_akhir,
            total_km: totalKm,
            total_bbm_terpakai: totalBbmCm, 
            jumlah_bbm_terpakai: bbmLiter, 
            rasio: rasio,
            keterangan: row.keterangan.trim() === "" ? "-" : row.keterangan
          };
        });

        const payload = { ...headerData, total_bbm_terpakai: grandTotalBBM.toFixed(1), details: processedDetails };
        
        const response = await fetch('http://localhost:3001/api/laporan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          alert('Data Berhasil Disimpan!');
          if (headerData.shift === 'Pagi') {
            setRows(createEmptyRows());
            setHeaderData(prev => ({ ...prev, shift: '', crew: '', supervisor: '' }));
          } else {
            window.location.reload();
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          alert('Gagal menyimpan laporan.');
        }
      } catch (error) {
        alert('Terjadi kesalahan koneksi server.');
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="min-h-screen bg-gray-50/50 p-4 md:p-6 font-sans text-gray-800 animate-fade-in">
        <div className="max-w-6xl mx-auto mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 border-b-2 border-red-600 w-fit pb-1 uppercase tracking-tight">Input Pemakaian BBM</h1>
            <p className="text-gray-500 text-xs mt-1 italic font-normal">Operational Fuel Tracking System</p>
          </div>
        </div>

        {/* 2. HEADER FORM */}
        <div className="max-w-6xl mx-auto bg-white p-5 rounded-xl shadow-sm border border-gray-200 mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-red-600"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col group">
              <label className="text-[10px] font-bold text-gray-500 uppercase mb-1.5 flex items-center gap-1.5"><Calendar size={12} className="text-red-600" /> Tanggal</label>
              <div className="relative cursor-pointer" onClick={handleCalendarClick}>
                <input ref={dateInputRef} type="date" name="tanggal" value={headerData.tanggal} onChange={handleHeaderChange} className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg px-3 py-2 cursor-pointer font-medium outline-none focus:ring-1 focus:ring-red-500" />
              </div>
            </div>
            <div className="flex flex-col group">
              <label className="text-[10px] font-bold text-gray-500 uppercase mb-1.5 flex items-center gap-1.5"><Clock size={12} className="text-red-600" /> Shift</label>
              <select name="shift" value={headerData.shift} onChange={handleHeaderChange} className="w-full bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-red-500 cursor-pointer font-medium">
                  <option value="">- Pilih Shift -</option>
                  <option value="Pagi">Pagi</option>
                  <option value="Malam">Malam</option>
              </select>
            </div>
            <div className="flex flex-col group">
              <label className="text-[10px] font-bold text-gray-500 uppercase mb-1.5 flex items-center gap-1.5"><Users size={12} className="text-red-600" /> Crew</label>
              <select name="crew" value={headerData.crew} onChange={handleHeaderChange} className="w-full bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-red-500 cursor-pointer font-medium">
                  <option value="">- Pilih Crew -</option>
                  <option value="A">Crew A</option><option value="B">Crew B</option><option value="C">Crew C</option>
              </select>
            </div>
            <div className="flex flex-col group">
              <label className="text-[10px] font-bold text-gray-500 uppercase mb-1.5 flex items-center gap-1.5"><FileText size={12} className="text-red-600" /> Supervisor</label>
              <input type="text" name="supervisor" value={headerData.supervisor} className="w-full bg-gray-100 border border-gray-200 text-gray-600 text-sm rounded-lg px-3 py-2 font-bold cursor-not-allowed" readOnly placeholder="....." />
            </div>
          </div>
        </div>

        {/* 3. CARD GRID SYSTEM */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4">
            {rows.map((row, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:border-red-300 transition-all flex flex-col group">
                    <div className="bg-white px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white text-xs font-black shadow-sm">
                                {index + 1}
                            </span>
                            <h3 className="font-black text-gray-800 text-base tracking-tight group-hover:text-red-600 transition-colors">
                                {row.unit}
                            </h3>
                        </div>
                    </div>

                    <div className="p-5 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-gray-400 uppercase ml-1 tracking-wider">Operator</label>
                                <input type="text" value={row.operator} ref={(el) => setInputRef(el, index, 'operator')} onKeyDown={(e) => handleKeyDown(e, index, 'operator')} onChange={(e) => handleRowChange(index, 'operator', e.target.value)} placeholder="Nama..." className="w-full bg-gray-50 border border-gray-100 rounded-xl p-2.5 text-sm font-bold outline-none focus:ring-1 focus:ring-red-500 transition-all" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-gray-400 uppercase ml-1 tracking-wider">Lokasi</label>
                                <select value={row.lokasi} ref={(el) => setInputRef(el, index, 'lokasi')} onChange={(e) => handleRowChange(index, 'lokasi', e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-xl p-2.5 text-sm font-bold outline-none cursor-pointer">
                                    <option value="">Pilih</option>
                                    {LOKASI_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 bg-gray-50/50 p-4 rounded-3xl border border-gray-100">
                            <div className="space-y-3">
                                <div className="border-b border-gray-200 pb-2">
                                    <label className="text-[8px] font-black text-gray-400 uppercase block text-center mb-1.5 tracking-widest">Data Awal</label>
                                    <input type="number" value={row.km_awal} ref={(el) => setInputRef(el, index, 'km_awal')} onKeyDown={(e) => handleKeyDown(e, index, 'km_awal')} onChange={(e) => handleRowChange(index, 'km_awal', e.target.value)} placeholder="KM" className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs font-bold text-center outline-none shadow-sm" />
                                    <input type="text" value={row.saldo_awal} ref={(el) => setInputRef(el, index, 'saldo_awal')} onKeyDown={(e) => handleKeyDown(e, index, 'saldo_awal')} onChange={(e) => handleRowChange(index, 'saldo_awal', e.target.value)} placeholder="SALDO" className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs font-bold text-center outline-none shadow-sm mt-2" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="border-b border-red-100 pb-2">
                                    <label className="text-[8px] font-black text-red-600 uppercase block text-center mb-1.5 tracking-widest">Data Akhir</label>
                                    <input type="number" value={row.km_akhir} ref={(el) => setInputRef(el, index, 'km_akhir')} onKeyDown={(e) => handleKeyDown(e, index, 'km_akhir')} onChange={(e) => handleRowChange(index, 'km_akhir', e.target.value)} placeholder="KM" className="w-full bg-white border-2 border-red-50 rounded-xl p-2.5 text-xs font-bold text-center outline-none focus:border-red-400 shadow-sm transition-all" />
                                    <input type="text" value={row.saldo_akhir} ref={(el) => setInputRef(el, index, 'saldo_akhir')} onKeyDown={(e) => handleKeyDown(e, index, 'saldo_akhir')} onChange={(e) => handleRowChange(index, 'saldo_akhir', e.target.value)} placeholder="SALDO" className="w-full bg-white border-2 border-red-50 rounded-xl p-2.5 text-xs font-bold text-center outline-none focus:border-red-400 shadow-sm mt-2 transition-all" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-gray-400 uppercase ml-1 tracking-tight">Keterangan</label>
                            <input type="text" value={row.keterangan} ref={(el) => setInputRef(el, index, 'keterangan')} onKeyDown={(e) => handleKeyDown(e, index, 'keterangan')} onChange={(e) => handleRowChange(index, 'keterangan', e.target.value)} placeholder="Catatan operasional..." className="w-full bg-transparent border-b border-gray-100 p-1 text-[10px] italic outline-none group-hover:border-red-100 transition-colors" />
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* BUTTON SIMPAN */}
        <div className="max-w-6xl mx-auto mt-10 flex justify-end pb-20 px-4 md:px-0">
          <button onClick={handleSubmit} disabled={isLoading} className="w-full md:w-fit flex items-center justify-center gap-3 px-12 py-4 bg-red-600 text-white font-black rounded-2xl shadow-xl hover:bg-red-700 transition-all active:scale-95 disabled:bg-gray-300 uppercase tracking-widest text-sm">
            {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>PROSES...</span>
                </>
            ) : (
                <>
                  <Save size={20} />
                  <span>SIMPAN LAPORAN UNIT</span>
                </>
            )}
          </button>
        </div>
      </div>
    );
};

export default FuelEntryForm;