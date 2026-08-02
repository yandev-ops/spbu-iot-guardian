import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Dashboard from "./pages/Dashboard.jsx";
import Copilot from "./pages/Copilot.jsx";
import Inventory from "./pages/Inventory.jsx";
import BottomNav from "./components/BottomNav.jsx";
import Sidebar from "./components/Sidebar.jsx";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 max-w-md mx-auto relative shadow-sm border-x border-slate-200">
      
      {/* ===== SIDEBAR OVERLAY ===== */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* ===== NAVBAR UTAMA ===== */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 h-14 px-4 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Buka Sidebar"
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-slate-100 active:bg-slate-200 transition-colors text-slate-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        <h1 className="text-sm font-bold text-slate-800 absolute left-1/2 -translate-x-1/2 whitespace-nowrap">
          SPBU IoT Guardian
        </h1>

        <div className="flex items-center gap-1">
          <button
            aria-label="Profil"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-slate-100 active:bg-slate-200 transition-colors"
          >
            <span className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
              Y
            </span>
          </button>
        </div>
      </header>

      <main className="p-6 pb-24">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/copilot" element={<Copilot />} />
          <Route path="/inventory" element={<Inventory />} />
        </Routes>
      </main>

      <BottomNav />
    </div>
  );
}

export default App;
