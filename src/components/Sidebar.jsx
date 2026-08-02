function MenuIcon({ path }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );
}

const MENU_ITEMS = [
  {
    section: "Akun",
    items: [
      {
        label: "Profil Saya",
        subtitle: "Kelola data akun kamu",
        color: "bg-blue-100 text-blue-600",
        path: "M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z",
      },
      {
        label: "Notifikasi",
        subtitle: "1 pemberitahuan baru",
        color: "bg-red-100 text-red-500",
        path: "M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0",
      },
    ],
  },
  {
    section: "Aplikasi",
    items: [
      {
        label: "Pengaturan",
        subtitle: "Preferensi & konfigurasi",
        color: "bg-slate-200 text-slate-600",
        path: "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.245a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.02-.397-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.28zM15 12a3 3 0 11-6 0 3 3 0 016 0z",
      },
      {
        label: "Bantuan & Dukungan",
        subtitle: "Hubungi tim & mentor",
        color: "bg-amber-100 text-amber-600",
        path: "M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zM12 17.25h.007v.008H12v-.008z",
      },
      {
        label: "Tentang Aplikasi",
        subtitle: "Versi 1.0.0",
        color: "bg-teal-100 text-teal-600",
        path: "M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z",
      },
    ],
  },
];

const LOGOUT_ICON = "M8.25 9V5.25A2.25 2.25 0 0110.5 3h6a2.25 2.25 0 012.25 2.25v13.5A2.25 2.25 0 0116.5 21h-6a2.25 2.25 0 01-2.25-2.25V15m-3 0l-3-3m0 0l3-3m-3 3H15";
const CHEVRON_DOWN = "M8.25 4.5l7.5 7.5-7.5 7.5";

export default function Sidebar({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[60] flex">
      <button
        aria-label="Tutup Overlay Sidebar"
        onClick={onClose}
        className="absolute inset-0 w-full h-full bg-slate-900/50 cursor-default"
      />

      <aside className="relative w-72 bg-slate-50 h-full shadow-2xl flex flex-col">
        {/* ===== HEADER ===== */}
        <header className="p-4 flex items-center justify-between">
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

        {/* ===== LIST MENU ===== */}
        <nav className="flex-1 px-3 overflow-y-auto">
          {MENU_ITEMS.map((group) => (
            <div key={group.section} className="mb-4">
              <p className="text-xs font-semibold text-slate-400 uppercase px-3 pb-2">
                {group.section}
              </p>
              <div className="space-y-1.5">
                {group.items.map((item) => (
                  <button
                    key={item.label}
                    className="w-full flex items-center gap-3 bg-white hover:bg-slate-100 active:bg-slate-200 rounded-2xl px-3 py-2.5 shadow-sm border border-slate-100 transition-colors text-left"
                  >
                    <span className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 ${item.color}`}>
                      <MenuIcon path={item.path} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{item.label}</p>
                      <p className="text-xs text-slate-400 truncate">{item.subtitle}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* ===== FOOTER AKUN ===== */}
        <div className="p-3 border-t border-slate-200">
          <button className="w-full flex items-center justify-between bg-white hover:bg-slate-100 rounded-2xl pl-2 pr-3 py-2 shadow-sm border border-slate-100 transition-colors">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                Y
              </span>
              <span className="text-sm font-semibold text-slate-800 truncate">
                SPBU IoT Guardian
              </span>
            </div>
            <MenuIcon path={CHEVRON_DOWN} />
          </button>

          <button className="w-full flex items-center gap-3 mt-2 text-left px-3 py-2 hover:bg-red-50 active:bg-red-100 rounded-xl text-red-600 font-medium text-sm transition-colors">
            <MenuIcon path={LOGOUT_ICON} />
            Keluar
          </button>
        </div>
      </aside>
    </div>
  );
}
