// Dashboard functionality
let apps = [];
let filteredApps = [];

// Load apps data
async function loadApps() {
    try {
        const response = await fetch('data/apps.json');
        apps = await response.json();
        filteredApps = [...apps];
        renderApps();
    } catch (error) {
        console.error('Error loading apps:', error);
        document.getElementById('apps-container').innerHTML = '<div class="error">Failed to load apps. Please try again later.</div>';
    }
}

// Render apps by categories with sliders
function renderApps() {
    const container = document.getElementById('apps-container');
    container.innerHTML = '';

    if (filteredApps.length === 0) {
        container.innerHTML = '<div class="loading">No apps found.</div>';
        return;
    }

    // Group apps by category
    const categories = {};
    filteredApps.forEach(app => {
        if (!categories[app.category]) {
            categories[app.category] = [];
        }
        categories[app.category].push(app);
    });

    // Render each category section
    Object.keys(categories).forEach(category => {
        const section = document.createElement('div');
        section.className = 'category-section';

        section.innerHTML = `
            <h2 class="category-title">${category}</h2>
            <div class="slider-container">
                <button class="slider-btn slider-prev" data-category="${category}"><</button>
                <div class="apps-slider" id="slider-${category}">
                    ${categories[category].map(app => `
                        <div class="app-card" onclick="openAppDetail('${app.id}')">
                            <img src="${app.icon}" alt="${app.name}" class="app-icon" loading="lazy">
                            <div class="app-info">
                                <h3>${app.name}</h3>
                                <p>${app.description.substring(0, 100)}${app.description.length > 100 ? '...' : ''}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <button class="slider-btn slider-next" data-category="${category}">></button>
            </div>
        `;

        container.appendChild(section);
    });
}

// Search functionality
document.getElementById('search')?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    filteredApps = apps.filter(app =>
        app.name.toLowerCase().includes(query) ||
        app.description.toLowerCase().includes(query) ||
        app.category.toLowerCase().includes(query)
    );
    renderApps();
});

// Open app detail page
function openAppDetail(appId) {
    window.location.href = `app-detail.html?id=${appId}`;
}

// User dashboard navigation
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('user-dashboard')?.addEventListener('click', () => {
        window.location.href = 'user-dashboard.html';
    });
});

// Slider navigation
function initSliderNavigation() {
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('slider-btn')) {
            const category = e.target.dataset.category;
            const slider = document.getElementById(`slider-${category}`);
            const scrollAmount = 320; // Card width + gap

            if (e.target.classList.contains('slider-prev')) {
                slider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else if (e.target.classList.contains('slider-next')) {
                slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    });
}

// Initialize dashboard
loadApps();
initSliderNavigation();
