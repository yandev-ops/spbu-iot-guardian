import { useEffect, useState } from "react";
import { refreshAllDeviceStatuses } from "../logic/stateMachine.js";
import StatusBadge from "../components/StatusBadge.jsx";

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
      <h2 className="text-xl font-semibold mb-4">Dashboard Monitoring</h2>
      <div className="space-y-5">
        {locations.map((loc) => {
          const siteDevices = devicesBySite[loc.spbu_id] || [];
          return (
            <div key={loc.spbu_id}>
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-slate-800 text-sm">{loc.name}</p>
                <span className="text-xs text-slate-400">{loc.region}</span>
              </div>
              <ul className="space-y-2">
                {siteDevices.map((d) => (
                  <li
                    key={d.device_id}
                    className="bg-white border rounded-md p-3 text-sm flex items-center justify-between"
                  >
                    <span>{d.type}</span>
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
