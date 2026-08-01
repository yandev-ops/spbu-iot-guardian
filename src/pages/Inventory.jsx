import { useEffect, useState } from "react";
import { refreshAllInventoryStatuses } from "../logic/stateMachine.js";

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

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Inventory & Prediksi</h2>
      {/* STUB: tampilan sementara, akan diganti komponen InventoryTable nanti */}
      <table className="w-full bg-white border rounded-md text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="p-3">Spare Part</th>
            <th className="p-3">Qty Tersedia</th>
            <th className="p-3">Reorder Point</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {parts.map((p) => (
            <tr key={p.part_id} className="border-b">
              <td className="p-3">{p.name}</td>
              <td className="p-3">{p.qty_available}</td>
              <td className="p-3">{p.reorder_point}</td>
              <td className="p-3 font-medium">{p.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Inventory;
