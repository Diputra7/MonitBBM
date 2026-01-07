 import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";

export default function PemakaianBBMForm() {
  const { tanggal: paramTanggal, shift: paramShift } = useParams();
  const navigate = useNavigate();

  const isEdit = paramTanggal && paramShift;

  const [tanggal, setTanggal] = useState("");
  const [shift, setShift] = useState("");
  const [crew, setCrew] = useState("");
  const [supervisor, setSupervisor] = useState("");

  const supervisorCrew = {
    A: "Sugianto - Efrizal",
    B: "Agus Salim - Halasan",
    C: "Firdaus - Chairul",
  };

  useEffect(() => {
    if (crew) {
      setSupervisor(supervisorCrew[crew] || "");
    }
  }, [crew]);

  // ================= 15 UNIT =================
  const units = Array.from({ length: 15 }, (_, i) => `27x122${31 + i}`);

  // ================= FIELD (1 OPERATOR) =================
  const fields = [
    "operator",
    "lokasi",
    "kmAwal",
    "saldoAwal",
    "kmAkhir",
    "saldoAkhir",
    "ket",
  ];

  const [rows, setRows] = useState(
    units.map((u) => ({
      unit: u,
      operator: "",
      lokasi: "",
      kmAwal: "",
      saldoAwal: "",
      kmAkhir: "",
      saldoAkhir: "",
      ket: "",
    }))
  );

  useEffect(() => {
    if (isEdit) {
      setTanggal(paramTanggal);
      setShift(paramShift);
      setCrew("A");
      setSupervisor(supervisorCrew["A"]);
    }
  }, [isEdit, paramTanggal, paramShift]);

  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  const handleKeyDown = (e, rowIndex, fieldIndex) => {
    const field = fields[fieldIndex];

    if (e.key === "Enter" || e.key === "ArrowDown") {
      e.preventDefault();
      const next = document.getElementById(`cell-${rowIndex + 1}-${field}`);
      if (next) next.focus();
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = document.getElementById(`cell-${rowIndex - 1}-${field}`);
      if (prev) prev.focus();
      return;
    }

    if (e.key === "ArrowRight") {
      e.preventDefault();
      const nextField = fields[fieldIndex + 1];
      if (!nextField) return;
      const next = document.getElementById(`cell-${rowIndex}-${nextField}`);
      if (next) next.focus();
      return;
    }

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prevField = fields[fieldIndex - 1];
      if (!prevField) return;
      const prev = document.getElementById(`cell-${rowIndex}-${prevField}`);
      if (prev) prev.focus();
    }
  };

  const handleSave = () => {
    const dataKirim = { tanggal, shift, crew, supervisor, detail: rows };
    console.log("DATA DISIMPAN:", dataKirim);
    alert("Data berhasil disimpan (dummy)");
    navigate("/PemakaianBBM");
  };

  return (
    <div className="min-h-screen p-4 bg-red-50">
      <div className="p-6 max-w-7xl mx-auto mb-10">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate("/PemakaianBBM")} className="text-red-600">
            <AiOutlineArrowLeft className="text-2xl" />
          </button>
          <h3 className="text-2xl font-bold text-red-600">
            Pengisian Pemakaian BBM
          </h3>
        </div>

        {/* Form Header */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">

          <div>
            <label className="font-semibold">Tanggal</label>
            <input
              type="date"
              disabled={isEdit}
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className={`w-full mt-1 p-3 rounded-lg ${
                isEdit ? "bg-gray-200" : "bg-gray-100"
              }`}
            />
          </div>

          <div>
            <label className="font-semibold">Shift</label>
            <select
              disabled={isEdit}
              value={shift}
              onChange={(e) => setShift(e.target.value)}
              className={`w-full mt-1 p-3 rounded-lg ${
                isEdit ? "bg-gray-200" : "bg-gray-100"
              }`}
            >
              <option value="">-- Pilih Shift --</option>
              <option value="Pagi">Pagi</option>
              <option value="Malam">Malam</option>
            </select>
          </div>

          <div>
            <label className="font-semibold">Crew</label>
            <select
              disabled={isEdit}
              value={crew}
              onChange={(e) => setCrew(e.target.value)}
              className={`w-full mt-1 p-3 rounded-lg ${
                isEdit ? "bg-gray-200" : "bg-gray-100"
              }`}
            >
              <option value="">-- Pilih Crew --</option>
              <option value="A">Crew A</option>
              <option value="B">Crew B</option>
              <option value="C">Crew C</option>
            </select>
          </div>

          <div>
            <label className="font-semibold">Supervisor</label>
            <input
              type="text"
              value={supervisor}
              readOnly
              className="w-full mt-1 p-3 rounded-lg bg-gray-100"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-red-100">
              <tr className="text-red-700 font-semibold text-center">
                <th className="border p-2">Unit</th>
                <th className="border p-2">Operator</th>
                <th className="border p-2">Lokasi</th>
                <th className="border p-2">KM Awal</th>
                <th className="border p-2">Saldo Awal</th>
                <th className="border p-2">KM Akhir</th>
                <th className="border p-2">Saldo Akhir</th>
                <th className="border p-2">Keterangan</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="even:bg-gray-50">
                  <td className="border p-2 text-center font-semibold bg-red-50">
                    {row.unit}
                  </td>

                  {fields.map((field, fieldIndex) => (
                    <td key={field} className="border p-2">
                      <input
                        id={`cell-${i}-${field}`}
                        className="w-full px-2 py-1 bg-gray-100 rounded"
                        value={row[field]}
                        onChange={(e) => handleChange(i, field, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, i, fieldIndex)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Save */}
        <div className="flex justify-end mt-6">
          <button
            onClick={handleSave}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
          >
            Simpan Data
          </button>
        </div>

      </div>
    </div>
  );
}
