import React, { useState } from 'react';
import { ArrowLeft, Save, Calendar } from 'lucide-react'; // Pastikan install lucide-react atau ganti icon lain

const FuelEntryForm = () => {
  // 1. State untuk Header Laporan
  const [headerData, setHeaderData] = useState({
    tanggal: '',
    shift: '',
    crew: '',
    supervisor: '',
  });

  // 2. Daftar Unit (Biasanya ini didapat dari API Master Data Unit, tapi kita hardcode sesuai gambar)
  const initialUnits = [
    "27x12231", "27x12232", "27x12233", "27x12234", "27x12235",
    "27x12236", "27x12237", "27x12238", "27x12239", "27x12240",
    "27x12241", "27x12242", "27x12243", "27x12244", "27x12245"
  ];

  // 3. State untuk Baris Tabel (Array of Objects)
  const [rows, setRows] = useState(
    initialUnits.map(unit => ({
      unit: unit,
      operator: '',
      lokasi: '',
      km_awal: '',
      saldo_awal: '',
      km_akhir: '',
      saldo_akhir: '',
      keterangan: ''
    }))
  );

  const [isLoading, setIsLoading] = useState(false);

  // --- HANDLER ---

  // Handle perubahan data header (Tanggal, Shift, dll)
  const handleHeaderChange = (e) => {
    const { name, value } = e.target;
    setHeaderData(prev => ({ ...prev, [name]: value }));
  };

  // Handle perubahan data di dalam tabel (Input Fuelman)
  const handleRowChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  // --- LOGIKA UTAMA (SUBMIT & HITUNG) ---
  const handleSubmit = async () => {
    // Validasi sederhana
    if (!headerData.tanggal || !headerData.shift) {
      alert("Mohon lengkapi Tanggal dan Shift terlebih dahulu!");
      return;
    }

    setIsLoading(true);

    try {
      // PROSES PERHITUNGAN MATEMATIKA (Invisible Math)
      // Kita hitung di sini sebelum dikirim ke API
      let grandTotalBBM = 0;

      const processedDetails = rows.map(row => {
        // Konversi string ke float (default 0 jika kosong)
        const kmAwal = parseFloat(row.km_awal) || 0;
        const kmAkhir = parseFloat(row.km_akhir) || 0;
        const saldoAwal = parseFloat(row.saldo_awal) || 0;
        const saldoAkhir = parseFloat(row.saldo_akhir) || 0;

        // 1. Hitung Total KM
        const totalKm = kmAkhir - kmAwal;

        // 2. Hitung Total BBM Terpakai (CM)
        const totalBbmCm = saldoAwal - saldoAkhir;

        // 3. Hitung Jumlah BBM Terpakai (Liter) -> Rumus: CM * 5
        const jumlahBbmLiter = totalBbmCm * 5;

        // 4. Hitung Rasio -> Rumus: Total KM / Jumlah BBM Liter
        // Hindari pembagian dengan nol
        const rasio = jumlahBbmLiter !== 0 ? (totalKm / jumlahBbmLiter).toFixed(2) : 0;

        // Akumulasi untuk header (Grand Total)
        if(jumlahBbmLiter > 0) grandTotalBBM += jumlahBbmLiter;

        // Kembalikan object lengkap untuk dikirim ke Database
        return {
          ...row, // data inputan user
          km_awal: kmAwal,
          km_akhir: kmAkhir,
          saldo_awal: saldoAwal,
          saldo_akhir: saldoAkhir,
          // Hasil Hitungan:
          total_km: totalKm,
          total_bbm_terpakai: totalBbmCm, // Masuk ke kolom 'total_bbm_terpakai' di DB (CM)
          jumlah_bbm_terpakai: jumlahBbmLiter, // Masuk ke kolom 'jumlah_bbm_terpakai' di DB (Liter)
          rasio: parseFloat(rasio)
        };
      });

      // Filter: Hanya kirim baris yang Operatornya diisi (agar tidak kirim data kosong ke DB)
      // Opsional: hapus .filter ini jika ingin menyimpan semua unit meski kosong
      const payloadDetails = processedDetails.filter(item => item.operator !== '' || item.km_awal !== 0);

      const payload = {
        ...headerData,
        total_bbm_terpakai: grandTotalBBM, // Total semua unit (Liter)
        details: payloadDetails
      };

      console.log("Mengirim Data:", payload);

      // KIRIM KE BACKEND
      const response = await fetch('http://localhost:3001/api/laporan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Data Berhasil Disimpan!');
        // Reset form atau redirect
        // setHeaderData({...})
      } else {
        alert('Gagal menyimpan: ' + result.error);
      }

    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan koneksi server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      {/* --- HEADER JUDUL --- */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4 text-red-600 font-semibold cursor-pointer hover:underline">
          <ArrowLeft size={20} /> Kembali
        </div>
        <h1 className="text-2xl font-bold text-red-600">
          Form Input Pemakaian BBM – Fuelman
        </h1>
      </div>

      {/* --- FORM HEADER (TANGGAL, SHIFT, DLL) --- */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Tanggal */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">Tanggal</label>
            <div className="relative">
              <input 
                type="date" 
                name="tanggal"
                value={headerData.tanggal}
                onChange={handleHeaderChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <Calendar className="absolute right-3 top-2.5 text-gray-400" size={16} />
            </div>
          </div>

          {/* Shift */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">Shift</label>
            <select 
              name="shift"
              value={headerData.shift}
              onChange={handleHeaderChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
            >
              <option value="">-- Pilih --</option>
              <option value="Pagi">Pagi</option>
              <option value="Malam">Malam</option>
            </select>
          </div>

          {/* Crew */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">Crew</label>
            <input 
              type="text" 
              name="crew"
              value={headerData.crew}
              onChange={handleHeaderChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50"
              placeholder="Ex: A"
            />
          </div>

          {/* Supervisor */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">Supervisor</label>
            <input 
              type="text" 
              name="supervisor"
              value={headerData.supervisor}
              onChange={handleHeaderChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50"
              placeholder="Nama Supervisor"
            />
          </div>
        </div>
      </div>

      {/* --- TABEL INPUT --- */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-white bg-red-600 uppercase font-bold text-xs">
              <tr>
                <th className="px-4 py-3 border-r border-red-500 w-32">Unit</th>
                <th className="px-4 py-3 border-r border-red-500 w-48">Operator</th>
                <th className="px-4 py-3 border-r border-red-500 w-32">Lokasi</th>
                <th className="px-4 py-3 border-r border-red-500 w-24">KM Awal</th>
                <th className="px-4 py-3 border-r border-red-500 w-24">Saldo Awal</th>
                <th className="px-4 py-3 border-r border-red-500 w-24">KM Akhir</th>
                <th className="px-4 py-3 border-r border-red-500 w-24">Saldo Akhir</th>
                <th className="px-4 py-3 w-64">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rows.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  {/* Unit (Read Only / Pre-filled) */}
                  <td className="px-4 py-2 font-medium text-gray-900 bg-gray-50 border-r">
                    {row.unit}
                  </td>

                  {/* Operator */}
                  <td className="p-0 border-r">
                    <input 
                      type="text" 
                      className="w-full h-full px-4 py-2 focus:ring-inset focus:ring-2 focus:ring-red-500 outline-none bg-transparent"
                      placeholder=""
                      value={row.operator}
                      onChange={(e) => handleRowChange(index, 'operator', e.target.value)}
                    />
                  </td>

                  {/* Lokasi */}
                  <td className="p-0 border-r">
                    <input 
                      type="text" 
                      className="w-full h-full px-4 py-2 focus:ring-inset focus:ring-2 focus:ring-red-500 outline-none bg-transparent"
                      value={row.lokasi}
                      onChange={(e) => handleRowChange(index, 'lokasi', e.target.value)}
                    />
                  </td>

                  {/* KM Awal (Number) */}
                  <td className="p-0 border-r">
                    <input 
                      type="number" 
                      className="w-full h-full px-4 py-2 text-center focus:ring-inset focus:ring-2 focus:ring-red-500 outline-none bg-transparent"
                      value={row.km_awal}
                      onChange={(e) => handleRowChange(index, 'km_awal', e.target.value)}
                    />
                  </td>

                  {/* Saldo Awal (Number) */}
                  <td className="p-0 border-r">
                    <input 
                      type="number" 
                      className="w-full h-full px-4 py-2 text-center focus:ring-inset focus:ring-2 focus:ring-red-500 outline-none bg-transparent"
                      value={row.saldo_awal}
                      onChange={(e) => handleRowChange(index, 'saldo_awal', e.target.value)}
                    />
                  </td>

                  {/* KM Akhir (Number) */}
                  <td className="p-0 border-r">
                    <input 
                      type="number" 
                      className="w-full h-full px-4 py-2 text-center focus:ring-inset focus:ring-2 focus:ring-red-500 outline-none bg-transparent"
                      value={row.km_akhir}
                      onChange={(e) => handleRowChange(index, 'km_akhir', e.target.value)}
                    />
                  </td>

                  {/* Saldo Akhir (Number) */}
                  <td className="p-0 border-r">
                    <input 
                      type="number" 
                      className="w-full h-full px-4 py-2 text-center focus:ring-inset focus:ring-2 focus:ring-red-500 outline-none bg-transparent"
                      value={row.saldo_akhir}
                      onChange={(e) => handleRowChange(index, 'saldo_akhir', e.target.value)}
                    />
                  </td>

                  {/* Keterangan */}
                  <td className="p-0">
                    <input 
                      type="text" 
                      className="w-full h-full px-4 py-2 focus:ring-inset focus:ring-2 focus:ring-red-500 outline-none bg-transparent"
                      value={row.keterangan}
                      onChange={(e) => handleRowChange(index, 'keterangan', e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- TOMBOL SIMPAN --- */}
      <div className="flex justify-end mt-6">
        <button 
          onClick={handleSubmit}
          disabled={isLoading}
          className={`flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white font-medium rounded shadow hover:bg-red-700 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Save size={18} />
          {isLoading ? 'Menyimpan...' : 'Simpan Data'}
        </button>
      </div>
    </div>
  );
};

export default FuelEntryForm;