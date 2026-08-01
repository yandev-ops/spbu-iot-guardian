/**
 * intentRouter.js
 * ----------------
 * Mensimulasikan peran Snowflake CoCo CLI sebagai lapisan NL → insight.
 * Menerima pertanyaan bahasa natural dari copilot chat, menentukan intent-nya,
 * lalu memfilter data yang relevan dari mock_data.json dan menyusun response.
 *
 * Catatan: di tahap produksi, fungsi routeQuery() ini yang akan diganti
 * dengan pemanggilan Snowflake CoCo CLI sesungguhnya — struktur input/output
 * (query string masuk, response tersusun keluar) dirancang tetap kompatibel.
 */

import {
  DEVICE_STATUS,
  getMaintenanceRecommendations,
} from "./stateMachine.js";

export const INTENT = {
  STATUS: "status_query",
  PREDICTIVE: "predictive_query",
  INVENTORY: "inventory_query",
  UNKNOWN: "unknown",
};

// ============================================================
// 1. INTENT DETECTION
// ============================================================

// Kata kunci sederhana untuk tiap intent (rule-based, cukup untuk MVP)
const INTENT_KEYWORDS = {
  [INTENT.PREDICTIVE]: [
    "prediksi",
    "diprediksi",
    "akan",
    "bulan depan",
    "minggu depan",
    "ke depan",
    "proyeksi",
  ],
  [INTENT.INVENTORY]: [
    "stok",
    "spare part",
    "part",
    "inventory",
    "reorder",
    "persediaan",
  ],
  [INTENT.STATUS]: [
    "status",
    "kritis",
    "mati",
    "rusak",
    "maintenance",
    "perlu dicek",
    "warning",
    "perangkat mana",
  ],
};

/**
 * Menentukan intent dari sebuah query berdasarkan kemunculan kata kunci.
 * Urutan pengecekan: PREDICTIVE > INVENTORY > STATUS,
 * karena kata "stok" & "prediksi" lebih spesifik dibanding kata umum "status".
 *
 * @param {string} query
 * @returns {string} salah satu dari INTENT
 */
export function detectIntent(query) {
  const q = query.toLowerCase();

  if (INTENT_KEYWORDS[INTENT.PREDICTIVE].some((kw) => q.includes(kw))) {
    return INTENT.PREDICTIVE;
  }
  if (INTENT_KEYWORDS[INTENT.INVENTORY].some((kw) => q.includes(kw))) {
    return INTENT.INVENTORY;
  }
  if (INTENT_KEYWORDS[INTENT.STATUS].some((kw) => q.includes(kw))) {
    return INTENT.STATUS;
  }
  return INTENT.UNKNOWN;
}

// ============================================================
// 2. HANDLER PER INTENT
// ============================================================

/**
 * Handler untuk status_query: mengembalikan device yang butuh perhatian
 * (WARNING/CRITICAL/DOWN), diurutkan dari yang paling parah.
 */
function handleStatusQuery({ devices, spareParts }) {
  const severityOrder = [
    DEVICE_STATUS.DOWN,
    DEVICE_STATUS.CRITICAL,
    DEVICE_STATUS.WARNING,
  ];

  const matched = devices
    .filter((d) => severityOrder.includes(d.status))
    .sort(
      (a, b) => severityOrder.indexOf(a.status) - severityOrder.indexOf(b.status)
    );

  const recommendations = getMaintenanceRecommendations(matched, spareParts);

  const summary =
    matched.length === 0
      ? "Semua perangkat dalam kondisi normal saat ini."
      : `${matched.length} perangkat butuh perhatian: ` +
        recommendations
          .slice(0, 3)
          .map((r) => `${r.device.type} di ${r.device.spbu_id} (${r.device.status})`)
          .join(", ") +
        (matched.length > 3 ? `, dan ${matched.length - 3} lainnya.` : ".");

  return {
    intent: INTENT.STATUS,
    matched_devices: matched.map((d) => d.device_id),
    recommendations,
    response_summary: summary,
  };
}

/**
 * Handler untuk predictive_query: mengembalikan device yang diproyeksikan
 * akan mencapai ambang usia komponen dalam N hari ke depan.
 */
function handlePredictiveQuery({ devices }, daysAhead = 30) {
  const now = new Date();

  const projected = devices.filter((d) => {
    const installed = new Date(d.installed_date);
    const ageMonthsNow = (now - installed) / (1000 * 60 * 60 * 24 * 30);
    const ageMonthsFuture =
      ageMonthsNow + daysAhead / 30;

    const thresholdMonths = d.component_lifespan_months * 0.9;

    // Device yang BELUM warning sekarang, tapi AKAN masuk ambang dalam daysAhead
    return (
      ageMonthsNow < thresholdMonths && ageMonthsFuture >= thresholdMonths
    );
  });

  const summary =
    projected.length === 0
      ? `Tidak ada perangkat yang diproyeksikan butuh maintenance dalam ${daysAhead} hari ke depan.`
      : `${projected.length} perangkat diproyeksikan mendekati usia komponen maksimal dalam ${daysAhead} hari ke depan: ` +
        projected.map((d) => `${d.type} (${d.spbu_id})`).join(", ") +
        ".";

  return {
    intent: INTENT.PREDICTIVE,
    matched_devices: projected.map((d) => d.device_id),
    response_summary: summary,
  };
}

/**
 * Handler untuk inventory_query: mengembalikan status spare part
 * yang perlu tindakan (PERLU_REORDER / STOCKOUT), plus keterkaitannya
 * dengan device yang sedang menunggu part tersebut.
 */
function handleInventoryQuery({ devices, spareParts }) {
  const needsAction = spareParts.filter((p) =>
    ["PERLU_REORDER", "STOCKOUT"].includes(p.status)
  );

  const summary =
    needsAction.length === 0
      ? "Semua stok spare part dalam kondisi aman."
      : `${needsAction.length} dari ${spareParts.length} spare part perlu tindakan: ` +
        needsAction
          .map((p) => `${p.name} (${p.qty_available}/${p.reorder_point}, ${p.status})`)
          .join(", ") +
        ". Rekomendasi: prioritaskan part dengan status STOCKOUT.";

  return {
    intent: INTENT.INVENTORY,
    matched_parts: needsAction.map((p) => p.part_id),
    response_summary: summary,
  };
}

// ============================================================
// 3. MAIN ROUTER
// ============================================================

/**
 * Entry point utama: terima query bahasa natural + data mentah,
 * kembalikan hasil terstruktur siap ditampilkan di UI chat.
 *
 * @param {string} query - pertanyaan user
 * @param {object} data - { devices, spareParts }
 * @returns {object} { intent, response_summary, ...detail }
 */
export function routeQuery(query, data) {
  const intent = detectIntent(query);

  switch (intent) {
    case INTENT.STATUS:
      return { query, ...handleStatusQuery(data) };
    case INTENT.PREDICTIVE:
      return { query, ...handlePredictiveQuery(data) };
    case INTENT.INVENTORY:
      return { query, ...handleInventoryQuery(data) };
    default:
      return {
        query,
        intent: INTENT.UNKNOWN,
        response_summary:
          "Maaf, aku belum bisa memahami pertanyaan itu. Coba tanyakan soal status perangkat, prediksi maintenance, atau stok spare part.",
      };
  }
}

