import StatusBadge from "./StatusBadge.jsx";

const PART_ICON_RULES = [
  {
    match: /baterai/i,
    color: "bg-amber-100 text-amber-600",
    path: "M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 5.25m8.5-5.25l1 5.25m-9.5 0h9.5",
  },
  {
    match: /sensor|tangki/i,
    color: "bg-teal-100 text-teal-600",
    path: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 7.5v6l3.75 2.25",
  },
  {
    match: /kamera|cctv/i,
    color: "bg-purple-100 text-purple-600",
    path: "M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z",
  },
  {
    match: /router|antena|4g/i,
    color: "bg-indigo-100 text-indigo-600",
    path: "M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z",
  },
  {
    match: /print|struk/i,
    color: "bg-slate-200 text-slate-600",
    path: "M6.72 13.829c-.24.03-.48.062-.72.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.32 0h.5a2.25 2.25 0 002.25-2.25v-6.5a2.25 2.25 0 00-2.25-2.25H6.34a2.25 2.25 0 00-2.25 2.25v6.5A2.25 2.25 0 006.34 18h.5m10.48 0H6.34",
  },
];

const DEFAULT_ICON = {
  color: "bg-slate-100 text-slate-500",
  path: "M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z",
};

function getPartIcon(name) {
  const rule = PART_ICON_RULES.find((r) => r.match.test(name));
  return rule || DEFAULT_ICON;
}

function InventoryCard({ part }) {
  const isLow = part.qty_available < part.reorder_point;
  const isStockout = part.qty_available === 0;
  const icon = getPartIcon(part.name);
  const progressPct = Math.min(100, (part.qty_available / (part.reorder_point * 2)) * 100);

  return (
    <div
      className={`bg-white border rounded-2xl p-4 shadow-sm ${
        isStockout ? "border-red-200" : "border-slate-100"
      }`}
    >
      <div className="flex items-start gap-3 mb-3">
        <span className={`flex items-center justify-center w-10 h-10 rounded-full shrink-0 ${icon.color}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d={icon.path} />
          </svg>
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-800 text-sm truncate">{part.name}</p>
          <p className="text-xs text-slate-400">Lead time {part.lead_time_hari} hari</p>
        </div>
        <StatusBadge status={part.status} />
      </div>

      <div className="flex items-center justify-between text-sm mb-1.5">
        <span className="text-slate-500">
          Stok:{" "}
          <span className={`font-semibold ${isLow ? "text-status-critical" : "text-slate-800"}`}>
            {part.qty_available}
          </span>{" "}
          <span className="text-slate-400">/ {part.reorder_point}</span>
        </span>
      </div>

      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all ${isLow ? "bg-status-critical" : "bg-status-normal"}`}
          style={{ width: `${progressPct}%` }}
        />
      </div>
    </div>
  );
}

export default InventoryCard;
