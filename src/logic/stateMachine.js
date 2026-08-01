/**
 * stateMachine.js
 * ----------------
 * Logic transisi status untuk:
 * 1. Device (perangkat IT/IoT)
 * 2. Inventory (spare part)
 *
 * File ini murni fungsi (tidak menyentuh UI), sehingga bisa diuji terpisah
 * dan mudah diganti dengan pemanggilan Snowflake CoCo CLI di tahap produksi.
 */

// ============================================================
// 1. DEVICE STATE MACHINE
// ============================================================

export const DEVICE_STATUS = {
  NORMAL: "NORMAL",
  WARNING: "WARNING",
  SCHEDULED_MAINTENANCE: "SCHEDULED_MAINTENANCE",
  WAITING_PART: "WAITING_PART",
  CRITICAL: "CRITICAL",
  DOWN: "DOWN",
};

/**
 * Menghitung berapa jam sejak heartbeat terakhir.
 */
function hoursSinceLastHeartbeat(device, now = new Date()) {
  const last = new Date(device.last_heartbeat);
  return (now - last) / (1000 * 60 * 60);
}

/**
 * Menghitung usia komponen dalam bulan sejak instalasi.
 */
function componentAgeMonths(device, now = new Date()) {
  const installed = new Date(device.installed_date);
  const diffMs = now - installed;
  return diffMs / (1000 * 60 * 60 * 24 * 30);
}

/**
 * Menentukan status device berikutnya berdasarkan kondisi terkini.
 * Fungsi ini bersifat "read-only": tidak memutasi objek device,
 * melainkan mengembalikan status yang seharusnya berlaku.
 *
 * @param {object} device - objek device dari mock_data.json
 * @param {object} options - { hasTechnicianCheckin, partAvailable, now }
 * @returns {string} status baru (salah satu dari DEVICE_STATUS)
 */
export function computeDeviceStatus(device, options = {}) {
  const {
    hasTechnicianCheckin = false,
    partAvailable = true,
    now = new Date(),
  } = options;

  const hoursSinceHeartbeat = hoursSinceLastHeartbeat(device, now);
  const ageMonths = componentAgeMonths(device, now);
  const currentStatus = device.status;

  // --- Kondisi darurat: tidak ada heartbeat sama sekali ---
  if (hoursSinceHeartbeat > 72) {
    return DEVICE_STATUS.DOWN;
  }
  if (hoursSinceHeartbeat > 24) {
    return DEVICE_STATUS.CRITICAL;
  }

  // --- Jika teknisi baru saja check-in untuk maintenance ---
  if (hasTechnicianCheckin) {
    return partAvailable
      ? DEVICE_STATUS.SCHEDULED_MAINTENANCE
      : DEVICE_STATUS.WAITING_PART;
  }

  // --- Jika sedang dalam proses maintenance/menunggu part, pertahankan ---
  if (
    currentStatus === DEVICE_STATUS.SCHEDULED_MAINTENANCE ||
    currentStatus === DEVICE_STATUS.WAITING_PART
  ) {
    return partAvailable
      ? DEVICE_STATUS.SCHEDULED_MAINTENANCE
      : DEVICE_STATUS.WAITING_PART;
  }

  // --- Evaluasi kondisi WARNING ---
  const uptimeLow = device.uptime_pct_7d < 95;
  const componentAging = ageMonths >= device.component_lifespan_months * 0.9; // 90% dari lifespan

  if (uptimeLow || componentAging) {
    return DEVICE_STATUS.WARNING;
  }

  return DEVICE_STATUS.NORMAL;
}

/**
 * Menerapkan computeDeviceStatus ke seluruh daftar device.
 * Berguna untuk me-refresh status dashboard.
 */
export function refreshAllDeviceStatuses(devices, now = new Date()) {
  return devices.map((device) => ({
    ...device,
    status: computeDeviceStatus(device, { now }),
  }));
}

// ============================================================
// 2. INVENTORY STATE MACHINE
// ============================================================

export const INVENTORY_STATUS = {
  STOK_AMAN: "STOK_AMAN",
  PERLU_REORDER: "PERLU_REORDER",
  ON_ORDER: "ON_ORDER",
  STOCKOUT: "STOCKOUT",
};

/**
 * Menghitung reorder point berdasarkan formula:
 * reorder_point = avg_kerusakan_per_bulan × (lead_time_hari / 30) + safety_stock
 */
export function calculateReorderPoint(part) {
  const demandDuringLeadTime =
    part.avg_kerusakan_per_bulan * (part.lead_time_hari / 30);
  return Math.ceil(demandDuringLeadTime + part.safety_stock);
}

/**
 * Menentukan status inventory berikutnya.
 *
 * @param {object} part - objek spare_parts dari mock_data.json
 * @param {object} options - { hasUrgentDemand, poApproved, stockReceived }
 * @returns {string} status baru (salah satu dari INVENTORY_STATUS)
 */
export function computeInventoryStatus(part, options = {}) {
  const {
    hasUrgentDemand = false,
    poApproved = false,
    stockReceived = false,
  } = options;

  const currentStatus = part.status;
  const reorderPoint = calculateReorderPoint(part);

  // --- Barang baru diterima dari PO ---
  if (currentStatus === INVENTORY_STATUS.ON_ORDER && stockReceived) {
    return INVENTORY_STATUS.STOK_AMAN;
  }

  // --- PO baru disetujui admin ---
  if (currentStatus === INVENTORY_STATUS.PERLU_REORDER && poApproved) {
    return INVENTORY_STATUS.ON_ORDER;
  }

  // --- Stok habis total & ada kebutuhan mendesak ---
  if (part.qty_available === 0 && hasUrgentDemand) {
    return INVENTORY_STATUS.STOCKOUT;
  }

  // --- Stok di bawah reorder point ---
  if (part.qty_available < reorderPoint) {
    return INVENTORY_STATUS.PERLU_REORDER;
  }

  return INVENTORY_STATUS.STOK_AMAN;
}

/**
 * Menerapkan computeInventoryStatus ke seluruh daftar spare part.
 */
export function refreshAllInventoryStatuses(spareParts) {
  return spareParts.map((part) => ({
    ...part,
    status: computeInventoryStatus(part),
    reorder_point: calculateReorderPoint(part),
  }));
}

// ============================================================
// 3. CROSS-CHECK: DEVICE <-> INVENTORY
// ============================================================

/**
 * Mengembalikan daftar device yang berstatus WARNING/CRITICAL
 * beserta info ketersediaan spare part yang dibutuhkan.
 * Ini adalah logic inti di balik rekomendasi aksi copilot.
 *
 * @param {Array} devices
 * @param {Array} spareParts
 * @returns {Array} daftar { device, part, canBeFixedNow }
 */
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

