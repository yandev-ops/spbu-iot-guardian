import { useEffect, useState } from "react";
import { refreshAllDeviceStatuses } from "../logic/stateMachine.js";
import StatusBadge from "../components/StatusBadge.jsx";

// Ikon per jenis perangkat, dengan warna latar masing-masing
const DEVICE_ICON_MAP = {
  EDC: {
    color: "bg-blue-100 text-blue-600",
    path: "M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z",
  },
  CCTV: {
    color: "bg-purple-100 text-purple-600",
    path: "M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z",
  },
  Printer: {
    color: "bg-slate-200 text-slate-600",
    path: "M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.32 0h.5a2.25 2.25 0 002.25-2.25v-6.5a2.25 2.25 0 00-2.25-2.25H6.34a2.25 2.25 0 00-2.25 2.25v6.5A2.25 2.25 0 006.34 18h.5m10.48 0H6.34",
  },
  "Sensor Tangki": {
    color: "bg-teal-100 text-teal-600",
    path: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 7.5v6l3.75 2.25",
  },
  Router: {
    color: "bg-indigo-100 text-indigo-600",
    path: "M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z",
  },
  PSU: {
    color: "bg-amber-100 text-amber-600",
    path: "M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 5.25m8.5-5.25l1 5.25m-9.5 0h9.5",
  },
};

const DEFAULT_ICON = {
  color: "bg-slate-100 text-slate-500",
  path: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
};

function DeviceIcon({ type }) {
  const icon = DEVICE_ICON_MAP[type] || DEFAULT_ICON;
  return (
    <span className={`flex items-center justify-center w-10 h-10 rounded-full shrink-0 ${icon.color}`}>
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d={icon.path} />
      </svg>
    </span>
  );
}

function Dashboard() {
  const [locations, setLocations] = useState([]);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/mock_data.json")
      .then((res) => res.json())
      .then((data) => {
        setLocations(data.spbu_locations);
        setDevices(refreshAllDeviceStatuses(data.devices));
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-slate-500">Memuat data...</p>;

  const devicesBySite = devices.reduce((acc, device) => {
    if (!acc[device.spbu_id]) acc[device.spbu_id] = [];
    acc[device.spbu_id].push(device);
    return acc;
  }, {});

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900 mb-5">Dashboard Monitoring</h2>
      <div className="space-y-6">
        {locations.map((loc) => {
          const siteDevices = devicesBySite[loc.spbu_id] || [];
          return (
            <div key={loc.spbu_id}>
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold text-slate-800 text-sm">{loc.name}</p>
                <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  {loc.region}
                </span>
              </div>
              <ul className="space-y-2.5">
                {siteDevices.map((d) => (
                  <li
                    key={d.device_id}
                    className="bg-white border border-slate-100 rounded-2xl p-3 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <DeviceIcon type={d.type} />
                    <span className="flex-1 text-sm font-medium text-slate-700">
                      {d.type}
                    </span>
                    <StatusBadge status={d.status} />
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Dashboard;
