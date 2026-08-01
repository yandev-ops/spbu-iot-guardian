function DeviceCard({ device }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "DOWN":
        return "bg-red-100 text-red-900 border-red-300";
      case "CRITICAL":
        return "bg-orange-100 text-orange-900 border-orange-300";
      case "WARNING":
        return "bg-yellow-100 text-yellow-900 border-yellow-300";
      case "SCHEDULED_MAINTENANCE":
        return "bg-blue-100 text-blue-900 border-blue-300";
      case "NORMAL":
        return "bg-green-100 text-green-900 border-green-300";
      default:
        return "bg-gray-100 text-gray-900 border-gray-300";
    }
  };

  return (
    <div className={`border rounded-lg p-4 mb-3 ${getStatusColor(device.status)}`}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-semibold text-base">{device.type}</p>
          <p className="text-sm opacity-75">ID: {device.device_id}</p>
        </div>
        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-white bg-opacity-50">
          {device.status}
        </span>
      </div>
      <p className="text-sm">SPBU: {device.spbu_id}</p>
    </div>
  );
}

export default DeviceCard;
