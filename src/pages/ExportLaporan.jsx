 import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ExportLaporan() {
  const [tanggal, setTanggal] = useState("");
  const [shift, setShift] = useState("All");

  const handleExportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text("Laporan Pemakaian BBM", 14, 15);

    doc.setFontSize(10);
    doc.text(`Tanggal : ${tanggal || "Semua"}`, 14, 25);
    doc.text(`Shift   : ${shift}`, 14, 32);

    autoTable(doc, {
      startY: 40,
      head: [["Shift", "Crew", "Supervisor"]],
      body: [
        ["Pagi", "2 Crew", "AGoy Gemez tim ronal academy"],
        ["Malam", "1 Crew", "EP"],
      ],
    });

    doc.save(`laporan-bbm-${tanggal || "all"}.pdf`);
  };

  return (
    <div className="bg-red-50 min-h-screen px-6 py-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg border border-red-200">

        <h2 className="text-xl font-bold text-red-600 mb-6">
          Export Laporan Pemakaian BBM
        </h2>

        {/* FILTER */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <input
            type="date"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            className="px-4 py-3 border rounded-xl"
          />

          <select
            value={shift}
            onChange={(e) => setShift(e.target.value)}
            className="px-4 py-3 border rounded-xl"
          >
            <option value="All">Semua Shift</option>
            <option value="Pagi">Shift Pagi</option>
            <option value="Malam">Shift Malam</option>
          </select>

          <button
            onClick={handleExportPDF}
            className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold"
          >
            Download PDF
          </button>
        </div>

      </div>
    </div>
  );
}
