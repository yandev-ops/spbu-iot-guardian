const STATUS_STYLES = {
  NORMAL: "bg-status-normal/10 text-status-normal border-status-normal/30",
  STOK_AMAN: "bg-status-normal/10 text-status-normal border-status-normal/30",
  WARNING: "bg-status-warning/10 text-status-warning border-status-warning/30",
  PERLU_REORDER: "bg-status-warning/10 text-status-warning border-status-warning/30",
  SCHEDULED_MAINTENANCE: "bg-status-warning/10 text-status-warning border-status-warning/30",
  WAITING_PART: "bg-status-warning/10 text-status-warning border-status-warning/30",
  ON_ORDER: "bg-status-warning/10 text-status-warning border-status-warning/30",
  CRITICAL: "bg-status-critical/10 text-status-critical border-status-critical/30",
  DOWN: "bg-status-down/10 text-status-down border-status-down/30",
  STOCKOUT: "bg-status-down/10 text-status-down border-status-down/30",
};

const STATUS_LABELS = {
  NORMAL: "Normal",
  WARNING: "Perlu Dicek",
  SCHEDULED_MAINTENANCE: "Terjadwal",
  WAITING_PART: "Tunggu Part",
  CRITICAL: "Kritis",
  DOWN: "Mati",
  STOK_AMAN: "Stok Aman",
  PERLU_REORDER: "Perlu Reorder",
  ON_ORDER: "Sedang Dipesan",
  STOCKOUT: "Stok Habis",
};

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || "bg-slate-100 text-slate-600 border-slate-300";
  const label = STATUS_LABELS[status] || status;

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${style}`}>
      {label}
    </span>
  );
}

export default StatusBadge;
