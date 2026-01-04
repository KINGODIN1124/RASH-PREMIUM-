// User dashboard functionality
let downloadHistory = [];

// Load user profile and history
async function loadUserDashboard() {
    const user = firebase.auth().currentUser;
    if (!user) {
        window.location.href = 'index.html';
        return;
    }

    // Load sign-in info
    loadSignInInfo(user);

    // Load download history
    loadDownloadHistory();

    // Calculate stats
    calculateStats();
}

// Load sign-in information
function loadSignInInfo(user) {
    const signInMethod = user.providerData[0]?.providerId === 'google.com' ? 'Google' : 'Anonymous';
    document.getElementById('signin-method').textContent = signInMethod;

    // Get sign-in date from localStorage or use current date
    const signInDate = localStorage.getItem('signin_date') || new Date().toLocaleDateString();
    document.getElementById('signin-date').textContent = signInDate;
}

// Load download history
async function loadDownloadHistory() {
    const user = firebase.auth().currentUser;

    try {
        if (user) {
            // Load from Firestore for logged-in users
            const querySnapshot = await db.collection('downloads')
                .where('userId', '==', user.uid)
                .orderBy('date', 'desc')
                .get();

            downloadHistory = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                // Group by app and version for count
                const existing = downloadHistory.find(d =>
                    d.appId === data.appId && d.version === data.version
                );
                if (existing) {
                    existing.count++;
                } else {
                    downloadHistory.push({
                        ...data,
                        count: 1
                    });
                }
            });
        } else {
            // Load from localStorage for guests
            downloadHistory = JSON.parse(localStorage.getItem('download_history') || '[]');
        }

        renderDownloadHistory();
    } catch (error) {
        console.error('Error loading download history:', error);
        downloadHistory = [];
        renderDownloadHistory();
    }
}

// Calculate and display stats
function calculateStats() {
    const totalDownloads = downloadHistory.length;
    const uniqueApps = new Set(downloadHistory.map(d => d.appId)).size;

    // Calculate weekly downloads
    const now = new Date();
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const weeklyDownloads = downloadHistory.filter(d => new Date(d.date) >= weekStart).length;

    // Find favorite category
    const categoryCount = {};
    downloadHistory.forEach(d => {
        if (categoryCount[d.category]) {
            categoryCount[d.category]++;
        } else {
            categoryCount[d.category] = 1;
        }
    });
    const favoriteCategory = Object.keys(categoryCount).reduce((a, b) =>
        categoryCount[a] > categoryCount[b] ? a : b, 'None');

    // Update UI
    document.getElementById('total-downloads').textContent = totalDownloads;
    document.getElementById('unique-apps').textContent = uniqueApps;
    document.getElementById('weekly-downloads').textContent = weeklyDownloads;
    document.getElementById('favorite-category').textContent = favoriteCategory || 'None';
}

// Render download history
function renderDownloadHistory() {
    const historyContainer = document.getElementById('download-history');

    if (downloadHistory.length === 0) {
        historyContainer.innerHTML = '<div class="no-history">No downloads yet. Start exploring apps!</div>';
        return;
    }

    // Sort by date (newest first)
    const sortedHistory = downloadHistory.sort((a, b) => new Date(b.date) - new Date(a.date));

    historyContainer.innerHTML = sortedHistory.map(download => `
        <div class="history-item">
            <div class="history-info">
                <h4>${download.appName}</h4>
                <p>Version: ${download.version} | Category: ${download.category}</p>
                <small>Downloaded on: ${new Date(download.date).toLocaleString()}</small>
            </div>
            <div class="download-count">${download.count}x</div>
        </div>
    `).join('');
}

// Tab switching
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('tab-btn')) {
        const tabName = e.target.dataset.tab;

        // Remove active class from all tabs
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        // Add active class to clicked tab
        e.target.classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }
});

// Back button
document.getElementById('back-btn')?.addEventListener('click', () => {
    window.location.href = 'dashboard.html';
});

// Initialize user dashboard
loadUserDashboard();
