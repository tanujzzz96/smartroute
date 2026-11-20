
function generateTransportOptions(distanceKm, drivingDurationMins) {
    return [
        { mode: "Ola / Uber Cab", time: drivingDurationMins, cost: Math.round(60 + (distanceKm * 22)), details: "Private air-conditioned cab" },
        { mode: "Auto Rickshaw", time: Math.round(drivingDurationMins * 1.1), cost: Math.round(50 + (distanceKm * 18)), details: "Standard 3-wheeler hire" },
        { mode: "Bike Taxi (Rapido)", time: Math.round(drivingDurationMins * 0.85), cost: Math.round(30 + (distanceKm * 12)), details: "Fastest two-wheeler ride" },
        { mode: "Local City Bus", time: Math.round(drivingDurationMins * 1.5) + 5, cost: 20, details: "Budget public transit" },
        { mode: "Walking", time: Math.round((distanceKm / 4.5) * 60), cost: 0, details: "Zero-cost pedestrian route" }
    ];
}

function renderTransportCards(options) {
    const container = document.getElementById("transportCardsContainer");
    container.innerHTML = "";

    let fastest = options.reduce((prev, curr) => prev.time < curr.time ? prev : curr);
    let cheapest = options.reduce((prev, curr) => prev.cost < curr.cost ? prev : curr);

    options.forEach(opt => {
        let isBest = (opt === fastest || opt === cheapest);
        let badgeText = opt === fastest ? "Fastest" : (opt === cheapest ? "Cheapest" : "");

        const card = document.createElement("div");
        card.className = `card ${isBest ? 'best-value' : ''}`;
        card.innerHTML = `
            <div class="card-header">
                <span>${opt.mode}</span>
                ${badgeText ? `<span class="badge">${badgeText}</span>` : ''}
            </div>
            <div class="card-details">
                <span>⏱️ ${opt.time} mins</span>
                <span>💰 ₹${opt.cost}</span>
                <span>📍 ${opt.details}</span>
            </div>
        `;
        container.appendChild(card);
    });
}