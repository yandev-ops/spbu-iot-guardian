# Business Logic — SPBU IoT Guardian

Dokumen ini menjelaskan logic transisi state machine dan formula yang dipakai
di `src/logic/stateMachine.js` dan `src/logic/intentRouter.js`.

---

## 1. Status Perangkat

State: `NORMAL | WARNING | CRITICAL | DOWN | SCHEDULED_MAINTENANCE | WAITING_PART`

Fungsi `computeDeviceStatus(device, options)` dievaluasi urut sebagai berikut:

| Urutan cek | Kondisi | Hasil |
|---|---|---|
| 1 | `hoursSinceLastHeartbeat > 72` | → **DOWN** |
| 2 | `hoursSinceLastHeartbeat > 24` | → **CRITICAL** |
| 3 | `hasTechnicianCheckin = true` | → **SCHEDULED_MAINTENANCE** (jika `partAvailable`), atau **WAITING_PART** (jika part belum tersedia) |
| 4 | status saat ini sudah `SCHEDULED_MAINTENANCE` / `WAITING_PART` | dipertahankan, mengikuti `partAvailable` |
| 5 | `uptime_pct_7d < 95` atau usia komponen ≥ 90% dari `component_lifespan_months` | → **WARNING** |
| 6 | tidak ada kondisi di atas | → **NORMAL** |

---

## 2. Status Inventory Spare Part

State: `STOK_AMAN | PERLU_REORDER | ON_ORDER | STOCKOUT`

### Formula Reorder Point (`calculateReorderPoint`)

```
reorder_point = ceil( avg_kerusakan_per_bulan × (lead_time_hari / 30) + safety_stock )
```

- `avg_kerusakan_per_bulan` — rata-rata unit rusak/terpakai per bulan.
- `lead_time_hari` — waktu pengiriman dari order ke barang tiba, dikonversi ke satuan bulan (`/30`).
- `safety_stock` — buffer tetap per part.

### Transisi (`computeInventoryStatus`), dicek urut:

| Urutan cek | Kondisi | Hasil |
|---|---|---|
| 1 | status = `ON_ORDER` dan `stockReceived = true` | → **STOK_AMAN** |
| 2 | status = `PERLU_REORDER` dan `poApproved = true` | → **ON_ORDER** |
| 3 | `qty_available === 0` dan `hasUrgentDemand = true` | → **STOCKOUT** |
| 4 | `qty_available < reorder_point` | → **PERLU_REORDER** |
| 5 | tidak ada kondisi di atas | → **STOK_AMAN** |

---

## 3. Cross-check Device ↔ Inventory (`getMaintenanceRecommendations`)

Untuk setiap device berstatus `WARNING`, `CRITICAL`, atau `DOWN`:
- Dicari `spare_parts` yang cocok lewat `device.required_part_id`.
- Jika `part.qty_available > 0` → rekomendasi: "Part tersedia — bisa langsung dijadwalkan maintenance."
- Jika tidak → rekomendasi: "Part tidak cukup — perlu reorder sebelum maintenance."

---

## 4. Intent Router (`intentRouter.js`)

Rule-based keyword matching, urutan prioritas pengecekan: PREDICTIVE > INVENTORY > STATUS.

| Intent | Kata kunci pemicu | Handler |
|---|---|---|
| `predictive_query` | prediksi, diprediksi, akan, bulan depan, minggu depan, ke depan, proyeksi | `handlePredictiveQuery` — proyeksi device yang akan melewati 90% usia komponen dalam N hari ke depan (default `daysAhead = 30`) |
| `inventory_query` | stok, spare part, part, inventory, reorder, persediaan | `handleInventoryQuery` — daftar part berstatus `PERLU_REORDER`/`STOCKOUT` |
| `status_query` | status, kritis, mati, rusak, maintenance, perlu dicek, warning, perangkat mana | `handleStatusQuery` — device DOWN/CRITICAL/WARNING, diurutkan dari paling parah |
| `unknown` | tidak cocok kata kunci mana pun | pesan fallback |

---

## 5. Ringkasan

- Semua logic murni fungsi (`stateMachine.js`, `intentRouter.js`), tidak menyentuh UI.
- Reorder point dihitung otomatis per part berdasarkan histori kerusakan dan lead time.
- Rekomendasi maintenance copilot selalu cross-check ketersediaan spare part sebelum menyarankan aksi.
