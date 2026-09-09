let map, titikLayer, ruteLayer;

// 1. Fungsi Transisi Tombol Home -> Peta
function submitForm() {
    const origin = document.getElementById('select-origin').value;
    const dest = document.getElementById('select-destination').value;

    if (!origin || !dest) {
        alert("Silakan pilih Titik Awal dan Titik Tujuan terlebih dahulu!");
        return;
    }

    // Tampilkan container peta
    document.getElementById('home-screen').style.display = 'none';
    document.getElementById('app-container').style.display = 'flex';

    // Inisialisasi peta jika belum ada
    initMap();

    // Paksa Leaflet menghitung ulang ukuran layar & fokus langsung ke garis rute
    setTimeout(() => {
        if (map) {
            map.invalidateSize();
            if (ruteLayer) {
                map.fitBounds(ruteLayer.getBounds());
            }
        }
    }, 250);
}

// 2. Inisialisasi Peta Leaflet
function initMap() {
    if (!map) {
        // Default koordinat Jabodetabek dengan level zoom pas
        map = L.map('map').setView([-6.175392, 106.827153], 11);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        loadMapData();
    }
}

// 3. Update Data Bon BBM
function applyBonData(km, liter, biaya) {
    document.getElementById('val-jarak').innerText = `${km} km`;
    document.getElementById('val-liter').innerText = `${liter} Liter`;
    document.getElementById('val-biaya').innerText = `Rp ${Number(biaya).toLocaleString('id-ID')}`;
}

// 4. Memuat GeoJSON & JSON
function loadMapData() {
    applyBonData(67.6, 12.6, 85499);

    fetch('assets/data/ringkasan.json')
        .then(res => res.json())
        .then(data => {
            applyBonData(data.total_km || 67.6, data.total_liter || 12.6, data.total_biaya || 85499);
        })
        .catch(err => console.log("Gagal memuat ringkasan.json"));

    fetch('assets/data/rute.geojson')
        .then(res => res.json())
        .then(data => {
            ruteLayer = L.geoJSON(data, {
                style: { color: '#1e88e5', weight: 5, opacity: 0.8 }
            }).addTo(map);

            // Fokuskan kamera peta ke seluruh jalur rute
            map.fitBounds(ruteLayer.getBounds());
        })
        .catch(err => console.error("Gagal memuat rute.geojson:", err));

    fetch('assets/data/titik_ujung.geojson')
        .then(res => res.json())
        .then(data => {
            titikLayer = L.geoJSON(data, {
                onEachFeature: function (feature, layer) {
                    const props = feature.properties || {};
                    const nama = props.nama_lokasi || props.nama || 'Titik Lokasi';
                    const tipe = props.kategori || props.type || 'Point';
                    layer.bindPopup(`<b>${nama}</b><br>Tipe: ${tipe}`);
                }
            }).addTo(map);
        })
        .catch(err => console.error("Gagal memuat titik_ujung.geojson:", err));
}

// 5. Kembali ke Form Awal
function kembaliKeHome() {
    document.getElementById('app-container').style.display = 'none';
    document.getElementById('home-screen').style.display = 'flex';
}

// 6. Filter Layer Titik
function filterData() {
    const selected = document.getElementById('filter-kategori').value.toLowerCase();
    if (!titikLayer) return;

    titikLayer.eachLayer(function (layer) {
        const propsStr = JSON.stringify(layer.feature.properties || {}).toLowerCase();

        if (selected === 'all') {
            map.addLayer(layer);
        } else if (selected === 'origin' && (propsStr.includes('origin') || propsStr.includes('awal') || propsStr.includes('tangerang'))) {
            map.addLayer(layer);
        } else if (selected === 'destination' && (propsStr.includes('destination') || propsStr.includes('akhir') || propsStr.includes('jakarta') || propsStr.includes('priok'))) {
            map.addLayer(layer);
        } else {
            map.removeLayer(layer);
        }
    });
}