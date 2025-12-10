let allAppsData = []; // Global variable to store all app data once fetched

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    const page = path.substring(path.lastIndexOf('/') + 1);

    if (page === 'dashboard.html' || page === 'app_detail.html') {
        fetch('data.json')
            .then(response => {
                if (!response.ok) throw new Error(`HTTP Error: Status ${response.status} loading data.json`);
                return response.json();
            })
            .then(data => {
                if (page === 'dashboard.html') {
                    allAppsData = data; // Store data globally
                    renderDashboard(allAppsData);
                    setupSearch(); // Set up the search listener
                } else if (page === 'app_detail.html') {
                    renderAppDetail(data);
                }
            })
            .catch(error => {
                console.error("Failed to load data:", error);
                const container = document.getElementById('app-grid-container') || document.getElementById('version-list-container');
                if (container) {
                    container.innerHTML = `<p class="error-message" style="display:block;">
                        Error loading data. Please check the 'data.json' file or contact support.
                    </p>`;
                }
            });
    }
});

// --- NEW FUNCTION: Setup Search Listener ---
function setupSearch() {
    const searchInput = document.getElementById('app-search');
    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            const query = event.target.value.toLowerCase();
            const filteredApps = allAppsData.filter(app => {
                // Check name and category against the query
                return app.name.toLowerCase().includes(query) ||
                       app.category.toLowerCase().includes(query);
            });
            renderDashboard(filteredApps); // Re-render the dashboard with filtered results
        });
    }
}

// --- Function to Render the Dashboard (App Grid) ---
function renderDashboard(apps) {
    const container = document.getElementById('app-grid-container');
    const noResults = document.getElementById('no-results');
    if (!container) return;

    container.innerHTML = ''; // Clear previous cards

    if (apps.length === 0) {
        noResults.style.display = 'block';
        return;
    } else {
        noResults.style.display = 'none';
    }

    apps.forEach(app => {
        // Find the latest version upload date
        // Note: Assuming the first version in the array is the latest
        const latestUpdate = app.versions.length > 0 ? app.versions[0].uploadDate : 'N/A';
        
        const linkCard = document.createElement('a');
        linkCard.href = `app_detail.html?id=${app.id}`; 
        linkCard.className = "link-card";
        
        linkCard.innerHTML = `
            <div class="icon">
                <img src="${app.icon}" alt="${app.name} Icon">
            </div>
            <div class="details">
                <h3>${app.name}</h3>
                <p>Category: ${app.category}</p>
                <p class="update-info">Last Update: ${latestUpdate}</p>
            </div>
        `;
        container.appendChild(linkCard);
    });
}

// --- Function to Render the App Detail Page (No changes needed here) ---
function renderAppDetail(apps) {
    const urlParams = new URLSearchParams(window.location.search);
    const appId = urlParams.get('id');

    const app = apps.find(a => a.id === appId);

    if (!app) {
        document.getElementById('app-name').textContent = "App Not Found";
        document.getElementById('app-category').textContent = "Error";
        document.getElementById('app-description').textContent = "The requested application could not be found in the database.";
        return;
    }

    document.getElementById('app-title').textContent = `${app.name} - Versions`;
    document.getElementById('app-name').textContent = app.name;
    document.getElementById('app-category').textContent = `Category: ${app.category}`;
    document.getElementById('app-description').textContent = app.description;

    const versionContainer = document.getElementById('version-list-container');
    
    app.versions.forEach(version => {
        const versionCard = document.createElement('div');
        versionCard.className = 'version-card';

        versionCard.innerHTML = `
            <div>
                <h4>Version: ${version.versionNumber}</h4>
                <p>Uploaded: ${version.uploadDate}</p>
            </div>
            <a href="${version.downloadLink}" target="_blank" class="download-button">Download Link</a>
        `;
        versionContainer.appendChild(versionCard);
    });
}
