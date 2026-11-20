

const locations = {
    "doon_university": { name: "Doon University Campus", lat: 30.2678, lng: 78.0459 },
    "clock_tower": { name: "Clock Tower (Ghantaghar)", lat: 30.3244, lng: 78.0339 },
    "railway_station": { name: "Dehradun Railway Station", lat: 30.3165, lng: 78.0322 },
    "isbt": { name: "ISBT Dehradun", lat: 30.2832, lng: 78.0031 },
    "pacific_mall": { name: "Pacific Mall (Rajpur Rd)", lat: 30.3782, lng: 78.0792 },
    "fri": { name: "Forest Research Institute (FRI)", lat: 30.3450, lng: 78.0080 },
    "robbers_cave": { name: "Robber's Cave (Guchhupani)", lat: 30.3744, lng: 78.0575 },
    "paltan_bazaar": { name: "Paltan Bazaar", lat: 30.3220, lng: 78.0410 },
    "rajpur_village": { name: "Rajpur Village", lat: 30.3850, lng: 78.0850 },
    "raipur": { name: "Raipur Chowk", lat: 30.3080, lng: 78.1090 }
};

let map;
let routeLayer = null;
let currentActiveRoutes = [];
let currentStartLoc = null;
let currentEndLoc = null;

document.addEventListener("DOMContentLoaded", () => {
    map = L.map('map').setView([30.2678, 78.0459], 13);

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: 'Tiles © Esri — Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, and GIS community'
    }).addTo(map);

    renderSearchHistory();
    document.getElementById("searchBtn").addEventListener("click", handleSearch);
});

async function handleSearch() {
    const startKey = document.getElementById("startLocation").value;
    const endKey = document.getElementById("endLocation").value;

    if (startKey === endKey) {
        alert("Start and destination cannot be the same!");
        return;
    }

    currentStartLoc = locations[startKey];
    currentEndLoc = locations[endKey];

    const result = await getRoute(currentStartLoc, currentEndLoc);

    if (result.success) {
        currentActiveRoutes = result.routes;
        
        
        renderRouteSelector(currentActiveRoutes);

        
        selectRoute(0);

        saveSearchHistory(currentStartLoc.name, currentEndLoc.name);
    } else {
        alert("Could not fetch route: " + result.message);
    }
}

function renderRouteSelector(routes) {
    const section = document.getElementById("routeSelectorSection");
    const container = document.getElementById("routeButtonsContainer");
    container.innerHTML = "";
    section.style.display = "block";

    routes.forEach((route, index) => {
        const btn = document.createElement("button");
        btn.className = `route-btn ${index === 0 ? 'active' : ''}`;
        btn.style.cssText = "padding: 8px 12px; margin: 4px; border: 1px solid #3498db; background: #fff; border-radius: 6px; cursor: pointer; font-size: 0.85rem;";
        btn.innerHTML = `<b>${route.name}</b><br>⏱️ ${route.duration} mins | 📏 ${route.distance} km`;
        
        btn.onclick = () => {
            // Highlight active button
            document.querySelectorAll(".route-btn").forEach(b => b.style.background = "#fff");
            btn.style.background = "#ebf5fb";
            selectRoute(index);
        };
        container.appendChild(btn);
    });
}

function selectRoute(index) {
    const route = currentActiveRoutes[index];
    if (!route) return;

    if (routeLayer) {
        map.removeLayer(routeLayer);
    }

    
    const latLngs = route.coordinates.map(coord => [coord[1], coord[0]]);
    routeLayer = L.polyline(latLngs, { color: index === 0 ? '#3498db' : '#e67e22', weight: 6, opacity: 0.8 }).addTo(map);
    map.fitBounds(routeLayer.getBounds(), { padding: [50, 50] });

    
    map.eachLayer((layer) => {
        if (layer instanceof L.Marker) map.removeLayer(layer);
    });
    L.marker([currentStartLoc.lat, currentStartLoc.lng]).addTo(map).bindPopup(`<b>Start:</b> ${currentStartLoc.name}`).openPopup();
    L.marker([currentEndLoc.lat, currentEndLoc.lng]).addTo(map).bindPopup(`<b>Destination:</b> ${currentEndLoc.name}`);

    
    const transportOptions = generateTransportOptions(route.distance, route.duration);
    renderTransportCards(transportOptions);
}