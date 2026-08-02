import { useEffect, useState } from "react";
import { refreshAllInventoryStatuses } from "../logic/stateMachine.js";
import InventoryCard from "../components/InventoryCard.jsx";

function Inventory() {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/mock_data.json")
      .then((res) => res.json())
      .then((data) => {
        setParts(refreshAllInventoryStatuses(data.spare_parts));
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-slate-500">Memuat data...</p>;

  const attentionCount = parts.filter(
    (p) => p.status === "PERLU_REORDER" || p.status === "STOCKOUT"
  ).length;
  const safeCount = parts.length - attentionCount;

  // Item yang butuh perhatian ditampilkan lebih dulu
  const sortedParts = [...parts].sort((a, b) => {
    const needsAttention = (s) => s === "PERLU_REORDER" || s === "STOCKOUT";
    return Number(needsAttention(b.status)) - Number(needsAttention(a.status));
  });

  return (
    <div>
      {/* ===== HERO HEADER ===== */}
      <div className="-mx-6 -mt-6 mb-6 px-6 pt-6 pb-8 bg-gradient-to-br from-teal-600 to-blue-500 rounded-b-3xl text-white">
        <p className="text-sm text-teal-100">Ringkasan Stok</p>
        <h2 className="text-2xl font-bold mb-4">Inventory & Prediksi</h2>
        <div className="flex gap-3">
          <div className="flex-1 bg-white/15 rounded-xl px-3 py-2 backdrop-blur-sm">
            <p className="text-xs text-teal-100">Total Part</p>
            <p className="text-lg font-bold">{parts.length}</p>
          </div>
          <div className="flex-1 bg-white/15 rounded-xl px-3 py-2 backdrop-blur-sm">
            <p className="text-xs text-teal-100">Aman</p>
            <p className="text-lg font-bold text-emerald-200">{safeCount}</p>
          </div>
          <div className="flex-1 bg-white/15 rounded-xl px-3 py-2 backdrop-blur-sm">
            <p className="text-xs text-teal-100">Perlu Perhatian</p>
            <p className="text-lg font-bold text-red-200">{attentionCount}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <p className="font-semibold text-slate-800 text-sm">Daftar Spare Part</p>
      </div>

      <div className="space-y-3">
        {sortedParts.map((p) => (
          <InventoryCard key={p.part_id} part={p} />
        ))}
      </div>
    </div>
  );
}

export default Inventory;
