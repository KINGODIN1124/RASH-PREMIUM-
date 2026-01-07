// Dashboard functionality with enhanced UI
let apps = [];
let filteredApps = [];
let currentSlides = {};

// 👑 OWNER BADGE + 🔔 PUSH NOTIFICATIONS
firebase.auth().onAuthStateChanged(user => {
    if (!user) return;

    // 👑 OWNER BADGE
    const OWNER_EMAIL = 'tripathi.shashwat133@gmail.com';

    if (user.email === OWNER_EMAIL) {
        const badge = document.getElementById('owner-badge');
        if (badge) badge.style.display = 'block';
    }

    // 🔔 ENABLE PHONE NOTIFICATIONS (STEP 4)
    if (typeof initPushNotifications === 'function') {
        initPushNotifications();
    }
});

// Load apps data
async function loadApps() {
    try {
        const response = await fetch('data/apps.json');
        apps = await response.json();
        filteredApps = [...apps];

        // Group apps by category
        const categories = {};
        filteredApps.forEach(app => {
            if (!categories[app.category]) {
                categories[app.category] = [];
            }
            categories[app.category].push(app);
        });

        renderDashboard(categories);
        initSliders();
    } catch (error) {
        console.error('Error loading apps:', error);
        document.getElementById('apps-container').innerHTML = '<div class="error">Failed to load apps. Please try again later.</div>';
    }
}

// Render dashboard with categorized sliders
function renderDashboard(categories) {
    const container = document.getElementById('apps-container');
    container.innerHTML = '';

    // Add welcome section
    const welcomeSection = document.createElement('div');
    welcomeSection.className = 'welcome-section';
    welcomeSection.id = 'welcome-section';
    welcomeSection.innerHTML = `
        <div class="welcome-content">
            <h2 class="welcome-title">Welcome to <span class="highlight">RASH MODS</span></h2>
            <p class="welcome-subtitle">Discover premium mobile applications curated just for you</p>
            <div class="welcome-features">
                <div class="feature">
                    <span class="feature-icon">🔒</span>
                    <span>Premium Apps</span>
                </div>
                <div class="feature">
                    <span class="feature-icon">📱</span>
                    <span>Mobile Optimized</span>
                </div>
                <div class="feature">
                    <span class="feature-icon">⚡</span>
                    <span>Fast Downloads</span>
                </div>
                <div class="feature">
                    <span class="feature-icon">⭐</span>
                    <span>Top Rated</span>
                </div>
            </div>
        </div>
    `;
    container.appendChild(welcomeSection);

    // Render each category as a slider
    Object.keys(categories).forEach((category, index) => {
        const categorySection = document.createElement('div');
        categorySection.className = 'category-section';
        categorySection.innerHTML = `
            <div class="category-header">
                <h2 class="category-title">
                    <span class="category-icon">${getCategoryIcon(category)}</span>
                    ${category}
                </h2>
                <div class="slider-controls">
                    <button class="slider-btn prev-btn" data-category="${category}">‹</button>
                    <button class="slider-btn next-btn" data-category="${category}">›</button>
                </div>
            </div>
            <div class="apps-slider-container">
                <div class="apps-slider" data-category="${category}">
                    ${categories[category].map((app, appIndex) => `
                        <div class="app-card" data-app-id="${app.id}" style="animation-delay: ${appIndex * 0.1}s">
                            <img src="${app.icon}" alt="${app.name}" class="app-icon" loading="lazy">
                            <div class="app-info">
                                <h3>
    ${app.name}
    ${app.verified ? '<span class="verified-badge">✔</span>' : ''}
</h3>
                                <p>${app.description}</p>
                                <div class="app-meta">
                                    <span class="rating">⭐ ${app.rating}</span>
                                    <span class="downloads">${app.downloads} downloads</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        container.appendChild(categorySection);
    });

    // Add event listeners to app cards
    document.querySelectorAll('.app-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const appId = e.currentTarget.dataset.appId;
            openAppDetail(appId);
        });
    });
}

// Get category icon
function getCategoryIcon(category) {
    const icons = {
        'Entertainment': '🎬',
        'Creative Tools': '🎨',
        'Utility': '🛠️',
        'Social': '👥',
        'Games': '🎮',
        'Productivity': '💼',
        'Health & Fitness': '💪',
        'Education': '📚',
        'Music': '🎵',
        'Photography': '📸',
        'Video': '🎥',
        'Weather': '🌤️',
        'Finance': '💰',
        'Travel': '✈️',
        'Food & Drink': '🍽️',
        'Lifestyle': '🏠',
        'News': '📰',
        'Shopping': '🛒',
        'Sports': '⚽',
        'Medical': '🏥'
    };
    return icons[category] || '📱';
}

// Initialize sliders
function initSliders() {
    const categories = document.querySelectorAll('.apps-slider');

    categories.forEach(slider => {
        const category = slider.dataset.category;
        currentSlides[category] = 0;

        const prevBtn = document.querySelector(`.prev-btn[data-category="${category}"]`);
        const nextBtn = document.querySelector(`.next-btn[data-category="${category}"]`);

        if (prevBtn) {
            prevBtn.addEventListener('click', () => slideCategory(category, -1));
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => slideCategory(category, 1));
        }

        // Update button states
        updateSliderButtons(category);
    });
}

// Slide category
function slideCategory(category, direction) {
    const slider = document.querySelector(`.apps-slider[data-category="${category}"]`);
    const cards = slider.querySelectorAll('.app-card');
    const cardWidth = 325; // card width + gap
    const maxSlides = Math.max(0, cards.length - Math.floor(slider.parentElement.offsetWidth / cardWidth));

    currentSlides[category] = Math.max(0, Math.min(maxSlides, currentSlides[category] + direction));

    slider.style.transform = `translateX(-${currentSlides[category] * cardWidth}px)`;

    updateSliderButtons(category);
}

// Update slider button states
function updateSliderButtons(category) {
    const prevBtn = document.querySelector(`.prev-btn[data-category="${category}"]`);
    const nextBtn = document.querySelector(`.next-btn[data-category="${category}"]`);
    const slider = document.querySelector(`.apps-slider[data-category="${category}"]`);
    const cards = slider.querySelectorAll('.app-card');
    const cardWidth = 325;
    const maxSlides = Math.max(0, cards.length - Math.floor(slider.parentElement.offsetWidth / cardWidth));

    if (prevBtn) {
        prevBtn.disabled = currentSlides[category] === 0;
        prevBtn.style.opacity = currentSlides[category] === 0 ? '0.5' : '1';
    }
    if (nextBtn) {
        nextBtn.disabled = currentSlides[category] >= maxSlides;
        nextBtn.style.opacity = currentSlides[category] >= maxSlides ? '0.5' : '1';
    }
}

// Search functionality
document.getElementById('search')?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const isSearching = e.target.value.trim() !== '';
toggleSearchUI(isSearching);

    if (query === '') {
        // Show all categories
        document.querySelectorAll('.category-section').forEach(section => {
            section.style.display = 'block';
        });
        return;
    }

    // Filter categories based on search
    const categories = document.querySelectorAll('.category-section');
    categories.forEach(section => {
        const categoryTitle = section.querySelector('.category-title').textContent.toLowerCase();
        const appCards = section.querySelectorAll('.app-card');

        let hasVisibleApps = false;
        appCards.forEach(card => {
            const appName = card.querySelector('h3').textContent.toLowerCase();
            const appDesc = card.querySelector('p').textContent.toLowerCase();

            if (appName.includes(query) || appDesc.includes(query) || categoryTitle.includes(query)) {
                card.style.display = 'block';
                hasVisibleApps = true;
            } else {
                card.style.display = 'none';
            }
        });

        section.style.display = hasVisibleApps ? 'block' : 'none';
    });
    // Check if any category is still visible
const anyVisible = Array.from(
    document.querySelectorAll('.category-section')
).some(section => section.style.display !== 'none');

showNoResultsMessage(!anyVisible);
});
function toggleSearchUI(isSearching) {
    const banner = document.getElementById('announcement-banner');
    const welcome = document.getElementById('welcome-section');

    if (banner) banner.style.display = isSearching ? 'none' : 'block';
    if (welcome) welcome.style.display = isSearching ? 'none' : 'block';
}
// Show / hide "no results" message
function showNoResultsMessage(show) {
    let msg = document.getElementById('no-results-message');

    if (!msg) {
        msg = document.createElement('div');
        msg.id = 'no-results-message';
        msg.className = 'no-results';
        msg.textContent = 'No premium apps match your search.';
        document.getElementById('apps-container').appendChild(msg);
    }

    msg.style.display = show ? 'block' : 'none';
}
// Open app detail page
function openAppDetail(appId) {
    window.location.href = `app-detail.html?id=${appId}`;
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    loadApps();

    // Add loading animation
    const container = document.getElementById('apps-container');
    container.innerHTML = `
        <div class="loading-screen">
            <div class="loading-spinner"></div>
            <h3>Loading Premium Apps...</h3>
        </div>
    `;
});
// 🔒 LOGOUT HANDLER
document.getElementById('logout')?.addEventListener('click', async () => {
    try {
        await firebase.auth().signOut();
        window.location.href = 'index.html';
    } catch (err) {
        console.error('Logout failed:', err);
    }
});


