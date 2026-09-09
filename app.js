let map, titikLayer, ruteLayer;

async function loadGeoJSON(filename) {
    const possiblePaths = [
        `./assets/data/${filename}`,
        `assets/data/${filename}`,
        `./${filename}`,
        `${filename}`
    ];

    for (const path of possiblePaths) {
        try {
            const response = await fetch(path);
            if (response.ok) {
                console.log(`Berhasil memuat ${filename} dari: ${path}`);
                return await response.json();
            }
        } catch (err) {
            // Coba path berikutnya
        }
    }
    throw new Error(`File ${filename} tidak ditemukan di jalur manapun.`);
}

function submitForm() {
    const origin = document.getElementById('select-origin').value;
    const dest = document.getElementById('select-destination').value;

    if (!origin || !dest) {
        alert("Silakan pilih Titik Awal dan Titik Tujuan terlebih dahulu!");
        return;
    }

    document.getElementById('home-screen').style.display = 'none';
    document.getElementById('app-container').style.display = 'flex';

    initMap();

    setTimeout(() => {
        if (map) {
            map.invalidateSize();
            if (ruteLayer) {
                map.fitBounds(ruteLayer.getBounds());
            }
        }
    }, 250);
}

function initMap() {
    if (!map) {
        map = L.map('map').setView([-6.175392, 106.827153], 11);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        loadMapData();
    }
}

function applyBonData(km, liter, biaya) {
    document.getElementById('val-jarak').innerText = `${km} km`;
    document.getElementById('val-liter').innerText = `${liter} Liter`;
    document.getElementById('val-biaya').innerText = `Rp ${Number(biaya).toLocaleString('id-ID')}`;
}

async function loadMapData() {
    applyBonData(67.6, 12.6, 85499);

    // Load Ringkasan
    try {
        const data = await loadGeoJSON('ringkasan.json');
        applyBonData(data.total_km || 67.6, data.total_liter || 12.6, data.total_biaya || 85499);
    } catch (e) {
        console.warn("Menggunakan fallback ringkasan.");
    }

    try {
        const data = await loadGeoJSON('rute.geojson');
        ruteLayer = L.geoJSON(data, {
            style: { color: '#1e88e5', weight: 5, opacity: 0.8 }
        }).addTo(map);

        map.fitBounds(ruteLayer.getBounds());
    } catch (e) {
        console.error("Gagal load rute:", e);
    }

    // Load Titik Marker
    try {
        const data = await loadGeoJSON('titik_ujung.geojson');
        titikLayer = L.geoJSON(data, {
            onEachFeature: function (feature, layer) {
                const props = feature.properties || {};
                const nama = props.nama_lokasi || props.nama || 'Titik Lokasi';
                const tipe = props.kategori || props.type || 'Point';
                layer.bindPopup(`<b>${nama}</b><br>Tipe: ${tipe}`);
            }
        }).addTo(map);
    } catch (e) {
        console.error("Gagal load titik_ujung:", e);
    }
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
