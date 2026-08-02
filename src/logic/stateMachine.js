export const DEVICE_STATUS = {
  NORMAL: "NORMAL",
  WARNING: "WARNING",
  SCHEDULED_MAINTENANCE: "SCHEDULED_MAINTENANCE",
  WAITING_PART: "WAITING_PART",
  CRITICAL: "CRITICAL",
  DOWN: "DOWN",
};

function hoursSinceLastHeartbeat(device, now = new Date()) {
  const last = new Date(device.last_heartbeat);
  return (now - last) / (1000 * 60 * 60);
}

function componentAgeMonths(device, now = new Date()) {
  const installed = new Date(device.installed_date);
  const diffMs = now - installed;
  return diffMs / (1000 * 60 * 60 * 24 * 30);
}

export function computeDeviceStatus(device, options = {}) {
  const {
    hasTechnicianCheckin = false,
    partAvailable = true,
    now = new Date(),
  } = options;

  const hoursSinceHeartbeat = hoursSinceLastHeartbeat(device, now);
  const ageMonths = componentAgeMonths(device, now);
  const currentStatus = device.status;

  if (hoursSinceHeartbeat > 72) {
    return DEVICE_STATUS.DOWN;
  }
  if (hoursSinceHeartbeat > 24) {
    return DEVICE_STATUS.CRITICAL;
  }

  if (hasTechnicianCheckin) {
    return partAvailable
      ? DEVICE_STATUS.SCHEDULED_MAINTENANCE
      : DEVICE_STATUS.WAITING_PART;
  }

  if (
    currentStatus === DEVICE_STATUS.SCHEDULED_MAINTENANCE ||
    currentStatus === DEVICE_STATUS.WAITING_PART
  ) {
    return partAvailable
      ? DEVICE_STATUS.SCHEDULED_MAINTENANCE
      : DEVICE_STATUS.WAITING_PART;
  }

  const uptimeLow = device.uptime_pct_7d < 95;
  const componentAging = ageMonths >= device.component_lifespan_months * 0.9;

  if (uptimeLow || componentAging) {
    return DEVICE_STATUS.WARNING;
  }

  return DEVICE_STATUS.NORMAL;
}

export function refreshAllDeviceStatuses(devices, now = new Date()) {
  return devices.map((device) => ({
    ...device,
    status: computeDeviceStatus(device, { now }),
  }));
}

export const INVENTORY_STATUS = {
  STOK_AMAN: "STOK_AMAN",
  PERLU_REORDER: "PERLU_REORDER",
  ON_ORDER: "ON_ORDER",
  STOCKOUT: "STOCKOUT",
};

export function calculateReorderPoint(part) {
  const demandDuringLeadTime =
    part.avg_kerusakan_per_bulan * (part.lead_time_hari / 30);
  return Math.ceil(demandDuringLeadTime + part.safety_stock);
}

export function computeInventoryStatus(part, options = {}) {
  const {
    poApproved = false,
    stockReceived = false,
  } = options;

  const currentStatus = part.status;
  const reorderPoint = calculateReorderPoint(part);

  if (currentStatus === INVENTORY_STATUS.ON_ORDER && stockReceived) {
    return INVENTORY_STATUS.STOK_AMAN;
  }

  if (currentStatus === INVENTORY_STATUS.PERLU_REORDER && poApproved) {
    return INVENTORY_STATUS.ON_ORDER;
  }

  if (part.qty_available === 0) {
    return INVENTORY_STATUS.STOCKOUT;
  }

  if (part.qty_available < reorderPoint) {
    return INVENTORY_STATUS.PERLU_REORDER;
  }

  return INVENTORY_STATUS.STOK_AMAN;
}

export function refreshAllInventoryStatuses(spareParts) {
  return spareParts.map((part) => ({
    ...part,
    status: computeInventoryStatus(part),
    reorder_point: calculateReorderPoint(part),
  }));
}

export function getMaintenanceRecommendations(devices, spareParts) {
  const partsById = Object.fromEntries(
    spareParts.map((p) => [p.part_id, p])
  );

  return devices
    .filter((d) =>
      [
        DEVICE_STATUS.WARNING,
        DEVICE_STATUS.CRITICAL,
        DEVICE_STATUS.DOWN,
      ].includes(d.status)
    )
    .map((device) => {
      const part = partsById[device.required_part_id] || null;
      const canBeFixedNow = part ? part.qty_available > 0 : false;

      return {
        device,
        part,
        canBeFixedNow,
        recommendation: canBeFixedNow
          ? `Part tersedia (${part.qty_available} unit) — bisa langsung dijadwalkan maintenance.`
          : `Part "${part ? part.name : "tidak diketahui"}" tidak cukup — perlu reorder sebelum maintenance.`,
      };
    });
}
