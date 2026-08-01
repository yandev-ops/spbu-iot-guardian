import StatusBadge from "./StatusBadge.jsx";

function InventoryCard({ part }) {
  const isLow = part.qty_available < part.reorder_point;

  return (
    <div className="bg-white border rounded-2xl p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="font-medium text-slate-800">{part.name}</p>
        <StatusBadge status={part.status} />
      </div>

      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>
          Stok:{" "}
          <span className={`font-semibold ${isLow ? "text-status-critical" : "text-slate-800"}`}>
            {part.qty_available}
          </span>{" "}
          / {part.reorder_point}
        </span>
        <span>Lead time: {part.lead_time_hari} hari</span>
      </div>

      <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${isLow ? "bg-status-critical" : "bg-status-normal"}`}
          style={{
            width: `${Math.min(100, (part.qty_available / (part.reorder_point * 2)) * 100)}%`,
          }}
        />
      </div>
    </div>
  );
}

export default InventoryCard;
