import { Routes, Route, NavLink } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Copilot from "./pages/Copilot.jsx";
import Inventory from "./pages/Inventory.jsx";

function App() {
  const navItemClass = ({ isActive }) =>
    `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? "bg-slate-900 text-white"
        : "text-slate-600 hover:bg-slate-100"
    }`;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-slate-800">
          🛡️ SPBU IoT Guardian
        </h1>
        <nav className="flex gap-2">
          <NavLink to="/" end className={navItemClass}>
            Dashboard
          </NavLink>
          <NavLink to="/copilot" className={navItemClass}>
            Copilot
          </NavLink>
          <NavLink to="/inventory" className={navItemClass}>
            Inventory
          </NavLink>
        </nav>
      </header>

      <main className="p-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/copilot" element={<Copilot />} />
          <Route path="/inventory" element={<Inventory />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

