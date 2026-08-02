export default function Sidebar({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[60] flex">
      {/* Latar gelap (Backdrop) - Klik untuk menutup */}
      <button
        aria-label="Tutup Overlay Sidebar"
        onClick={onClose}
        className="absolute inset-0 w-full h-full bg-slate-900/50 cursor-default"
      />

      {/* Panel Konten Sidebar */}
      <aside className="relative w-64 bg-white h-full shadow-2xl flex flex-col">
        <header className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-800 text-lg">Menu Utama</h2>
          
          <button
            onClick={onClose}
            aria-label="Tutup Sidebar"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-slate-100 active:bg-slate-200 text-slate-500 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
          <button className="min-h-[44px] text-left px-4 py-2 hover:bg-slate-50 active:bg-slate-100 rounded-xl text-slate-700 font-medium transition-colors">
            Pengaturan
          </button>
          <button className="min-h-[44px] text-left px-4 py-2 hover:bg-slate-50 active:bg-slate-100 rounded-xl text-slate-700 font-medium transition-colors">
            Bantuan & Dukungan
          </button>
          
          <div className="mt-auto pt-4 border-t border-slate-100">
            <button className="w-full min-h-[44px] text-left px-4 py-2 hover:bg-red-50 active:bg-red-100 rounded-xl text-red-600 font-medium transition-colors">
              Keluar
            </button>
          </div>
        </nav>
      </aside>
    </div>
  );
}
