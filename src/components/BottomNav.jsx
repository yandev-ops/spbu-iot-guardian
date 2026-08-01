import { NavLink } from "react-router-dom";

function BottomNav() {
  const itemClass = ({ isActive }) =>
    `flex-1 py-2 text-center text-sm ${
      isActive ? "text-slate-900 font-medium" : "text-slate-600"
    }`;

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center">
      <div className="w-full max-w-md bg-white border-t">
        <nav className="flex">
          <NavLink to="/" end className={itemClass}>
            Dashboard
          </NavLink>
          <NavLink to="/copilot" className={itemClass}>
            Copilot
          </NavLink>
          <NavLink to="/inventory" className={itemClass}>
            Inventory
          </NavLink>
        </nav>
      </div>
    </div>
  );
}

export default BottomNav;
