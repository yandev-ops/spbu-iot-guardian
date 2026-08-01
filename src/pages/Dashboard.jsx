import { useEffect, useState } from "react";
import { refreshAllDeviceStatuses } from "../logic/stateMachine.js";

function Dashboard() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/mock_data.json")
      .then((res) => res.json())
      .then((data) => {
        setDevices(refreshAllDeviceStatuses(data.devices));
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-slate-500">Memuat data...</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Dashboard Monitoring</h2>
      {/* STUB: tampilan sementara, akan diganti komponen DeviceCard nanti */}
      <ul className="space-y-2">
        {devices.map((d) => (
          <li key={d.device_id} className="bg-white border rounded-md p-3 text-sm">
            {d.type} — {d.spbu_id} — <span className="font-medium">{d.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
