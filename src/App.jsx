import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Copilot from "./pages/Copilot.jsx";
import Inventory from "./pages/Inventory.jsx";
import BottomNav from "./components/BottomNav.jsx";

function App() {
  return (
    <div className="min-h-screen bg-slate-50 max-w-md mx-auto">
      <header className="bg-white border-b py-2">
        <h1 className="text-sm font-medium text-slate-800 text-center">SPBU IoT Guardian</h1>
      </header>

      <main className="p-6 pb-20">
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
