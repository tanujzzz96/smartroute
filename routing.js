

async function getRoute(startCoords, endCoords) {
    if (!startCoords || !endCoords) {
        console.error("Start or end coordinates are missing!");
        return { success: false, message: "Missing coordinates" };
    }

    const startStr = `${startCoords.lng},${startCoords.lat}`;
    const endStr = `${endCoords.lng},${endCoords.lat}`;
    
    
    const url = `https://router.project-osrm.org/route/v1/driving/${startStr};${endStr}?overview=full&geometries=geojson&alternatives=true`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.code === "Ok" && data.routes && data.routes.length > 0) {
            
            const formattedRoutes = data.routes.map((route, index) => {
                return {
                    id: index,
                    distance: parseFloat((route.distance / 1000).toFixed(2)),
                    duration: Math.round(route.duration / 60),
                    coordinates: route.geometry.coordinates, // [lng, lat]
                    name: index === 0 ? "Fastest Route (Highway)" : `Alternative Route ${index + 1}`
                };
            });

            return {
                success: true,
                routes: formattedRoutes
            };
        } else {
            throw new Error("No valid route found between these points.");
        }
    } catch (error) {
        console.error("Routing error:", error);
        return {
            success: false,
            message: error.message
        };
    }
}