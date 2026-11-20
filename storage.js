const STORAGE_KEY = "smartroute_history";

function saveSearchHistory(startName, endName) {
    let history = getSearchHistory();
    const queryStr = `${startName} ➔ ${endName}`;
    
    
    if (history.length === 0 || history[0] !== queryStr) {
        history.unshift(queryStr);
        if (history.length > 5) history.pop(); 
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    }
    renderSearchHistory();
}

function getSearchHistory() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

function renderSearchHistory() {
    const historyList = document.getElementById("historyList");
    if (!historyList) return;
    
    const history = getSearchHistory();
    historyList.innerHTML = "";

    if (history.length === 0) {
        historyList.innerHTML = "<li>No recent searches</li>";
        return;
    }

    history.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        historyList.appendChild(li);
    });
}