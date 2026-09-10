# EngkelRoute GIS - WebGIS Truk Engkel

WebGIS sederhana untuk visualisasi rute operasional dan simulasi biaya BBM Truk Engkel (CDE) rute Tangerang - Jakarta.

## Akses Proyek
* **Live WebGIS**: https://web-gis-five.vercel.app/
* **Repository**: https://github.com/createbysyafiq/web_gis

---

## Fitur Utama & Poin Bonus
- **Home Screen Form**: Form input pilihan lokasi awal dan tujuan sebelum ke tampilan peta.
- **Peta Interaktif**: Visualisasi rute jalan dan marker titik lokasi pakai Leaflet.js.
- **Bon BBM Operasional (Bonus)**: Kalkulasi otomatis jarak tempuh, konsumsi solar, dan estimasi biaya operasional.
- **Filter Layer (Bonus)**: Dropdown untuk memfilter titik lokasi (Origin / Destination).

---

## Parameter Kendaraan
- **Jenis Kendaraan**: Truk Engkel / Colt Diesel Engkel (CDE)
- **Bahan Bakar**: Biosolar (Rp 6.800 / Liter)
- **Efisiensi Mesin**: 1 Liter / 8 km
- **Alasan**: Konsumsi rata-rata truk diesel kargo kelas ringan dengan muatan sedang pada rute kombinasi perkotaan dan antarkota berkisar di angka 7–8 km/L.

---

## Preprocessing Data (QGIS)
Data diambil dari dataset `K-08_truk-engkel`:
1. Validasi proyeksi koordinat (*CRS*) seluruh file ke **EPSG:4326 (WGS 84)** di QGIS.
2. Cek dan rapihin tabel atribut titik lokasi (Origin & Destination).
3. Ekspor layer ke format **GeoJSON** untuk dipanggil oleh Leaflet.js.

---

## Tech Stack
- HTML5, CSS3, Vanilla JavaScript
- Leaflet.js & OpenStreetMap
- QGIS (Preprocessing Data)
- Vercel (Deployment)

---

## Struktur Folder
```text
web_gis/
├── index.html
├── style.css
├── app.js
├── README.md
└── assets/
    └── data/
        ├── rute.geojson
        ├── titik_ujung.geojson
        └── ringkasan.json
