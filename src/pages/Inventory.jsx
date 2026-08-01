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

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Inventory & Prediksi</h2>

      <div className="mb-4">
        <div className="inline-flex items-center gap-3 px-3 py-2 bg-white rounded-lg shadow-sm text-sm font-medium">
          <span className="text-slate-600">Bagian perlu perhatian</span>
          <span className="inline-flex items-center justify-center bg-red-50 text-red-700 rounded-full px-2 py-0.5 text-xs font-semibold">
            {attentionCount}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {parts.map((p) => (
          <InventoryCard key={p.part_id} part={p} />
        ))}
      </div>
    </div>
  );
}

export default Inventory;
