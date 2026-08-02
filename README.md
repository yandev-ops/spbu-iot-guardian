```markdown
# SPBU IoT Guardian

AI copilot untuk **preventive maintenance & inventory management** perangkat IT/IoT di SPBU — dibangun untuk **Snowflake CoCo CLI Hackathon 2026**.

> Membantu tim lapangan memantau kesehatan perangkat (EDC, sensor tangki, CCTV, router, printer, PSU) di ratusan SPBU secara real-time, memprediksi kebutuhan maintenance, dan merekomendasikan aksi reorder spare part — semua lewat percakapan bahasa natural.

**Live Demo:** https://spbu-iot-guardian.vercel.app/
**Video Demo:** _[akan diisi]_
**Slide Presentasi:** _[akan diisi]_

---

## Problem Statement

SPBU Pertamina memiliki ribuan perangkat IT & IoT tersebar di banyak lokasi (EDC, sensor level tangki, CCTV, router, printer struk, PSU). Pemantauan manual membuat:
- Kerusakan sering terdeteksi terlambat (reaktif, bukan preventif)
- Stok spare part tidak sinkron dengan kebutuhan lapangan
- Tim maintenance kesulitan memprioritaskan lokasi mana yang perlu ditangani dulu

**SPBU IoT Guardian** menjawab ini dengan copilot berbasis natural language yang menggabungkan data status perangkat dan inventory spare part menjadi rekomendasi aksi yang actionable.

---

## Fitur Utama

1. **Dashboard Monitoring** — status seluruh perangkat di semua SPBU (Normal/Warning/Critical/Down), dikelompokkan per lokasi.
2. **AI Copilot Chat** — tanya dalam bahasa natural, misal:
   - *"Perangkat mana yang butuh maintenance minggu ini?"*
   - *"Stok spare part sensor tangki masih cukup nggak?"*
3. **Inventory & Prediksi** — status stok spare part vs kebutuhan proyeksi, dengan alert reorder otomatis.

---

## Arsitektur

```

Frontend (React)
   └── Dashboard | Copilot Chat | Inventory View
        │
        ▼
Application Layer (Logic)
   └── State Machine Engine (status perangkat & inventory)
   └── Query Intent Router (status / predictive / inventory query)
   └── Rekomendasi Engine (cross-check device ↔ spare part)
        │
        ▼
Data Layer
   └── mock_data.json (spbu_locations, devices, spare_parts, maintenance_logs)
        │
        ▼
Snowflake CoCo CLI (pola query divalidasi manual, lihat catatan di bawah)
```

Seluruh logic aplikasi yang di-deploy berjalan client-side (tanpa backend server terpisah), sehingga deploy cukup melalui static hosting (Vercel/Netlify).

---

## Status Integrasi Snowflake CoCo

Karena keterbatasan waktu hackathon, aplikasi yang di-deploy saat ini menggunakan `mock_data.json` sebagai data layer, bukan koneksi langsung ke Snowflake.

Namun, pola query natural-language yang dipakai di AI Copilot Chat (mis. *"perangkat mana yang critical atau down, dan spare part apa yang mereka butuhkan?"*) telah **diuji coba secara terpisah lewat sesi nyata di Snowflake CoCo** (Snowsight), terhadap sample data devices & spare parts yang di-load ke tabel Snowflake. Hasil sesi ini didokumentasikan di video demo.

Integrasi langsung CoCo CLI ke aplikasi (menggantikan mock data layer) adalah langkah lanjutan yang direncanakan pasca-hackathon — lihat bagian Roadmap.

---

## State Machine

### Status Perangkat
```

NORMAL → WARNING → SCHEDULED_MAINTENANCE → NORMAL
WARNING → CRITICAL → DOWN → NORMAL
SCHEDULED_MAINTENANCE → WAITING_PART → SCHEDULED_MAINTENANCE
```

### Status Inventory Spare Part
```
STOK_AMAN → PERLU_REORDER → ON_ORDER → STOK_AMAN
STOK_AMAN → STOCKOUT (jika demand mendesak & qty = 0)
```

---

## Tech Stack

- **Frontend:** React + Tailwind CSS
- **Data (saat ini):** JSON mock data, merepresentasikan struktur yang sama dengan tabel Snowflake
- **Validasi query:** Snowflake CoCo (Snowsight), diuji manual terhadap sample data — lihat video demo
- **Deployment:** Vercel / Netlify (static hosting)

---

## Struktur Folder

```
spbu-iot-guardian/
├── public/
│   └── mock_data.json
├── src/
│   ├── components/       # DashboardCard, ChatBubble, InventoryTable, dll
│   ├── logic/
│   │   ├── stateMachine.js
│   │   └── intentRouter.js
│   ├── pages/            # Dashboard, Copilot, Inventory
│   └── App.jsx
├── README.md
└── package.json

```

---

## Cara Menjalankan Secara Lokal

```bash
git clone https://github.com/yandev-ops/spbu-iot-guardian.git
cd spbu-iot-guardian
npm install
npm run dev
```

Buka `http://localhost:5173` di browser.

---

## Roadmap

- Integrasi langsung Snowflake CoCo CLI ke aplikasi (menggantikan mock data layer)
- Integrasi data sensor real-time dari perangkat IoT
- Notifikasi push ke tim operasional
- Sistem login multi-user dengan akses berjenjang per region

---

## Dibuat Oleh Suyanto

Solo project untuk Snowflake CoCo CLI Hackathon 2026.
```
