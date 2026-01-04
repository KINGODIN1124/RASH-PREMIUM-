// App detail functionality
let currentApp = null;

// Get app ID from URL
const urlParams = new URLSearchParams(window.location.search);
const appId = urlParams.get('id');

// Load app details
async function loadAppDetails() {
    if (!appId) {
        document.getElementById('app-details').innerHTML = '<div class="error">App not found.</div>';
        return;
    }

    try {
        const response = await fetch('data/apps.json');
        const apps = await response.json();
        currentApp = apps.find(app => app.id === appId);

        if (!currentApp) {
            document.getElementById('app-details').innerHTML = '<div class="error">App not found.</div>';
            return;
        }

        renderAppDetails();
    } catch (error) {
        console.error('Error loading app details:', error);
        document.getElementById('app-details').innerHTML = '<div class="error">Failed to load app details.</div>';
    }
}

// Render app details
function renderAppDetails() {
    document.getElementById('app-title').textContent = currentApp.name;

    const detailsContainer = document.getElementById('app-details');
    detailsContainer.innerHTML = `
        <div class="app-header">
            <img src="${currentApp.icon}" alt="${currentApp.name}" class="app-icon-large" loading="lazy">
            <div class="app-meta">
                <h2>${currentApp.name}</h2>
                <span class="category">${currentApp.category}</span>
                <p class="description">${currentApp.description}</p>
                <div class="app-stats">
                    <div class="stat-item">⭐ 4.8 Rating</div>
                    <div class="stat-item">📥 10K+ Downloads</div>
                    <div class="stat-item">🔒 Premium App</div>
                </div>
            </div>
        </div>

        <div class="app-sections">
            <div class="section">
                <h3>Screenshots</h3>
                <div class="screenshots">
                    <img src="https://via.placeholder.com/200x350/333/fff?text=Screenshot+1" alt="Screenshot 1" loading="lazy">
                    <img src="https://via.placeholder.com/200x350/333/fff?text=Screenshot+2" alt="Screenshot 2" loading="lazy">
                    <img src="https://via.placeholder.com/200x350/333/fff?text=Screenshot+3" alt="Screenshot 3" loading="lazy">
                </div>
            </div>

            <div class="section">
                <h3>System Requirements</h3>
                <ul class="requirements">
                    <li>Android 8.0 or higher</li>
                    <li>2GB RAM minimum</li>
                    <li>500MB free storage</li>
                    <li>Internet connection for activation</li>
                </ul>
            </div>

            <div class="section">
                <h3>What's New</h3>
                <div class="changelog">
                    <div class="changelog-item">
                        <h4>Latest Update</h4>
                        <p>• Improved performance and stability</p>
                        <p>• New user interface enhancements</p>
                        <p>• Bug fixes and optimizations</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="versions">
            <h3>Available Versions</h3>
            ${currentApp.versions.map(version => `
                <div class="version-item">
                    <div class="version-info">
                        <h4>Version ${version.version}</h4>
                        <p>Released: ${version.releaseDate} | Size: ${version.size}</p>
                    </div>
                    <button class="btn btn-primary download-btn" data-version="${version.version}">Download</button>
                </div>
            `).join('')}
        </div>

        <div class="section">
            <h3>User Reviews</h3>
            <div class="review-form">
                <h4>Write a Review</h4>
                <div class="rating-input">
                    <label>Rating:</label>
                    <div class="stars">
                        <span class="star" data-rating="1">⭐</span>
                        <span class="star" data-rating="2">⭐</span>
                        <span class="star" data-rating="3">⭐</span>
                        <span class="star" data-rating="4">⭐</span>
                        <span class="star" data-rating="5">⭐</span>
                    </div>
                </div>
                <textarea id="review-text" placeholder="Share your experience with this app..." rows="4"></textarea>
                <button id="submit-review" class="btn btn-primary">Submit Review</button>
            </div>
            <div class="reviews" id="reviews-list">
                <!-- Reviews will be loaded here -->
            </div>
        </div>
    `;

    // Add download event listeners
    document.querySelectorAll('.download-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const version = e.target.dataset.version;
            showDownloadModal(version);
        });
    });

    // Initialize reviews
    loadReviews();
    initReviewForm();
}

// Show download modal
function showDownloadModal(version) {
    const modal = document.getElementById('download-modal');
    const modalText = document.getElementById('modal-text');
    modalText.textContent = `Are you sure you want to download ${currentApp.name} version ${version}?`;

    modal.classList.add('show');

    // Handle download confirmation
    document.getElementById('confirm-download').onclick = () => {
        handleDownload(version);
        modal.classList.remove('show');
    };

    document.getElementById('cancel-download').onclick = () => {
        modal.classList.remove('show');
    };
}

// Handle download
function handleDownload(version) {
    // Check weekly download limit
    const downloads = getWeeklyDownloads();
    if (downloads >= 5) { // 5 downloads per week limit
        alert('You have reached the weekly download limit (5 downloads). Please try again next week.');
        return;
    }

    // Record download
    recordDownload(version);

    // Simulate download
    alert(`Downloading ${currentApp.name} version ${version}...`);
    // In a real app, this would trigger the actual download
}

// Get weekly downloads count
function getWeeklyDownloads() {
    const now = new Date();
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const key = `downloads_${weekStart.toISOString().split('T')[0]}`;
    return parseInt(localStorage.getItem(key) || '0');
}

// Record download
async function recordDownload(version) {
    const now = new Date();
    const user = firebase.auth().currentUser;

    try {
        if (user) {
            // Save to Firestore for logged-in users
            await db.collection('downloads').add({
                userId: user.uid,
                appId: currentApp.id,
                appName: currentApp.name,
                version: version,
                category: currentApp.category,
                date: now.toISOString()
            });
        } else {
            // Save to localStorage for guests
            const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
            const key = `downloads_${weekStart.toISOString().split('T')[0]}`;
            const current = parseInt(localStorage.getItem(key) || '0');
            localStorage.setItem(key, current + 1);

            // Record detailed history
            const history = JSON.parse(localStorage.getItem('download_history') || '[]');
            const existingEntry = history.find(h => h.appId === currentApp.id && h.version === version);

            if (existingEntry) {
                existingEntry.count += 1;
                existingEntry.date = now.toISOString();
            } else {
                history.push({
                    appId: currentApp.id,
                    appName: currentApp.name,
                    version: version,
                    category: currentApp.category,
                    date: now.toISOString(),
                    count: 1
                });
            }

            localStorage.setItem('download_history', JSON.stringify(history));
        }
    } catch (error) {
        console.error('Error recording download:', error);
    }
}

// Back button
document.getElementById('back-btn')?.addEventListener('click', () => {
    window.location.href = 'dashboard.html';
});

// User dashboard navigation
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('user-dashboard')?.addEventListener('click', () => {
        window.location.href = 'user-dashboard.html';
    });
});

// Review functionality
let selectedRating = 0;

// Load reviews for this app
async function loadReviews() {
    const user = firebase.auth().currentUser;
    const reviewsList = document.getElementById('reviews-list');

    try {
        let reviews = [];

        if (user) {
            // Load from Firestore for logged-in users
            const querySnapshot = await db.collection('reviews')
                .where('appId', '==', appId)
                .orderBy('date', 'desc')
                .get();

            querySnapshot.forEach((doc) => {
                reviews.push(doc.data());
            });
        } else {
            // Load from localStorage for guests
            reviews = JSON.parse(localStorage.getItem(`reviews_${appId}`) || '[]');
            reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
        }

        if (reviews.length === 0) {
            reviewsList.innerHTML = '<p class="no-reviews">No reviews yet. Be the first to review this app!</p>';
            return;
        }

        reviewsList.innerHTML = reviews.map(review => `
            <div class="review-item">
                <div class="review-header">
                    <span class="review-author">${review.author || 'Anonymous'}</span>
                    <span class="review-rating">${'⭐'.repeat(review.rating)}</span>
                </div>
                <p class="review-text">${review.text}</p>
                <small class="review-date">${new Date(review.date).toLocaleDateString()}</small>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading reviews:', error);
        reviewsList.innerHTML = '<p class="error">Failed to load reviews.</p>';
    }
}

// Initialize review form
function initReviewForm() {
    // Star rating selection
    const starsContainer = document.querySelector('.stars');
    if (starsContainer) {
        starsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('star')) {
                selectedRating = parseInt(e.target.dataset.rating);
                updateStarDisplay();
            }
        });
    }

    // Submit review
    document.getElementById('submit-review')?.addEventListener('click', submitReview);
}

// Update star display
function updateStarDisplay() {
    document.querySelectorAll('.star').forEach((star, index) => {
        if (index < selectedRating) {
            star.classList.add('selected');
        } else {
            star.classList.remove('selected');
        }
    });
}

// Submit review
async function submitReview() {
    const reviewText = document.getElementById('review-text').value.trim();

    if (selectedRating === 0) {
        alert('Please select a rating.');
        return;
    }

    if (!reviewText) {
        alert('Please write a review.');
        return;
    }

    const user = firebase.auth().currentUser;
    const review = {
        author: user?.displayName || user?.email || 'Anonymous',
        rating: selectedRating,
        text: reviewText,
        date: new Date().toISOString(),
        appId: appId,
        userId: user?.uid || 'anonymous'
    };

    try {
        if (user) {
            // Save to Firestore for logged-in users
            await db.collection('reviews').add(review);
        } else {
            // Save to localStorage for guests
            const reviews = JSON.parse(localStorage.getItem(`reviews_${appId}`) || '[]');
            reviews.push(review);
            localStorage.setItem(`reviews_${appId}`, JSON.stringify(reviews));
        }

        // Clear form
        selectedRating = 0;
        document.getElementById('review-text').value = '';
        updateStarDisplay();

        // Reload reviews
        loadReviews();

        alert('Review submitted successfully!');
    } catch (error) {
        console.error('Error submitting review:', error);
        alert('Failed to submit review. Please try again.');
    }
}

// Initialize app detail page
loadAppDetails();
