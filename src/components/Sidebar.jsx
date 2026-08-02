export default function Sidebar({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[60] flex">
      <button
        aria-label="Tutup Overlay Sidebar"
        onClick={onClose}
        className="absolute inset-0 w-full h-full bg-slate-900/50 cursor-default"
      />

      <aside className="relative w-[85%] max-w-sm bg-slate-50 h-full shadow-2xl flex flex-col">
        {/* ===== HEADER ===== */}
        <header className="p-4 flex items-center justify-between border-b border-slate-200">
          <h2 className="font-bold text-slate-800 text-lg">Menu Utama</h2>
          <button
            onClick={onClose}
            aria-label="Tutup Sidebar"
            className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full hover:bg-slate-200 active:bg-slate-300 text-slate-500 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        {/* ===== TENTANG APLIKASI ===== */}
        <div className="flex-1 p-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-blue-100 text-blue-600 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
              </span>
              <div>
                <p className="font-semibold text-slate-800 text-sm">SPBU IoT Guardian</p>
                <p className="text-xs text-slate-400">Versi 1.0.0</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              AI copilot untuk preventive maintenance & inventory management perangkat IT/IoT di SPBU. Dibangun untuk Snowflake CoCo CLI Hackathon 2026.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
