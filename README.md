# SPBU IoT Guardian

AI copilot untuk **preventive maintenance & inventory management** perangkat IT/IoT di SPBU, dibangun untuk **Snowflake CoCo CLI Hackathon 2026**.

> Membantu tim lapangan memantau kesehatan perangkat (EDC, sensor tangki, CCTV, router, printer, PSU) di ratusan SPBU secara real-time, memprediksi kebutuhan maintenance, dan merekomendasikan aksi reorder spare part melalui percakapan bahasa natural.

**Live Demo:** https://spbu-iot-guardian.vercel.app/  

---

## Problem Statement

SPBU Pertamina memiliki ribuan perangkat IT & IoT yang tersebar di banyak lokasi, seperti EDC, sensor level tangki, CCTV, router, printer struk, dan PSU.

Pemantauan manual menimbulkan beberapa masalah:

- Kerusakan sering terdeteksi terlambat sehingga maintenance bersifat reaktif.
- Stok spare part tidak selalu sinkron dengan kebutuhan lapangan.
- Tim maintenance kesulitan menentukan lokasi yang harus ditangani terlebih dahulu.

**SPBU IoT Guardian** menjawab masalah tersebut dengan copilot berbasis natural language yang menggabungkan data status perangkat dan inventory spare part untuk menghasilkan rekomendasi aksi yang actionable.

---

## Fitur Utama

### 1. Dashboard Monitoring

Memantau status seluruh perangkat di semua SPBU berdasarkan kondisi:

- Normal
- Warning
- Critical
- Down

Status perangkat dikelompokkan berdasarkan lokasi SPBU.

### 2. AI Copilot Chat

Memungkinkan pengguna melakukan query menggunakan bahasa natural.

Contoh:

- *"Perangkat mana yang butuh maintenance minggu ini?"*
- *"Stok spare part sensor tangki masih cukup nggak?"*

### 3. Inventory & Prediksi

Menampilkan kondisi stok spare part dibandingkan dengan kebutuhan yang diproyeksikan, termasuk alert untuk kebutuhan reorder.

---

## Arsitektur

```text
Frontend (React)
   └── Dashboard | Copilot Chat | Inventory View
        │
        ▼
Application Layer (Logic)
   ├── State Machine Engine
   │   └── Status perangkat & inventory
   ├── Query Intent Router
   │   └── Status / predictive / inventory query
   └── Recommendation Engine
       └── Cross-check device ↔ spare part
        │
        ▼
Data Layer
   └── mock_data.json
       ├── spbu_locations
       ├── devices
       ├── spare_parts
       └── maintenance_logs
        │
        ▼
Snowflake CoCo CLI
   └── Natural-language query validation

Seluruh logic aplikasi yang di-deploy berjalan client-side tanpa backend server terpisah, sehingga aplikasi dapat di-deploy menggunakan static hosting seperti Vercel atau Netlify.


---

Status Integrasi Snowflake CoCo

Aplikasi yang di-deploy saat ini menggunakan mock_data.json sebagai data layer dan belum menggunakan koneksi langsung ke Snowflake.

Pola query natural-language yang digunakan pada AI Copilot Chat telah diuji secara terpisah melalui sesi nyata di Snowflake CoCo (Snowsight) menggunakan sample data perangkat dan spare part yang telah dimuat ke tabel Snowflake.

Contoh query:

> "Perangkat mana yang critical atau down, dan spare part apa yang mereka butuhkan?"



Hasil pengujian tersebut didokumentasikan dalam video demo.

Integrasi langsung Snowflake CoCo ke aplikasi untuk menggantikan mock data layer direncanakan sebagai pengembangan berikutnya.


---

State Machine

Status Perangkat

NORMAL → WARNING → SCHEDULED_MAINTENANCE → NORMAL
WARNING → CRITICAL → DOWN → NORMAL
SCHEDULED_MAINTENANCE → WAITING_PART → SCHEDULED_MAINTENANCE

Status Inventory Spare Part

STOK_AMAN → PERLU_REORDER → ON_ORDER → STOK_AMAN
STOK_AMAN → STOCKOUT


---

Tech Stack

Frontend: React + Tailwind CSS

Data: JSON mock data yang merepresentasikan struktur tabel Snowflake

Query Validation: Snowflake CoCo (Snowsight)

Deployment: Vercel / Netlify



---

Struktur Folder

spbu-iot-guardian/
├── public/
│   └── mock_data.json
├── src/
│   ├── components/
│   │   ├── DashboardCard
│   │   ├── ChatBubble
│   │   └── InventoryTable
│   ├── logic/
│   │   ├── stateMachine.js
│   │   └── intentRouter.js
│   ├── pages/
│   │   ├── Dashboard
│   │   ├── Copilot
│   │   └── Inventory
│   └── App.jsx
├── README.md
└── package.json


---

Cara Menjalankan Secara Lokal

git clone https://github.com/yandev-ops/spbu-iot-guardian.git
cd spbu-iot-guardian
npm install
npm run dev

Buka http://localhost:5173 di browser.


---

Roadmap

Integrasi langsung Snowflake CoCo ke aplikasi.

Integrasi data sensor real-time dari perangkat IoT.

Notifikasi push untuk tim operasional.

Sistem login multi-user dengan akses berjenjang berdasarkan region.



---

Dibuat Oleh Suyanto

Solo project untuk Snowflake CoCo CLI Hackathon 2026.
