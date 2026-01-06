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
        // Add entrance animations
        setTimeout(() => {
            document.querySelectorAll('.section').forEach((section, index) => {
                section.style.animation = `slideInUp 0.6s ease-out ${index * 0.1}s both`;
            });
        }, 100);
    } catch (error) {
        console.error('Error loading app details:', error);
        document.getElementById('app-details').innerHTML = '<div class="error">Failed to load app details.</div>';
    }
}

// Render app details with improved UI
function renderAppDetails() {
    document.getElementById('app-title').textContent = currentApp.name;

    const detailsContainer = document.getElementById('app-details');
    detailsContainer.innerHTML = `
        <div class="app-hero">
            <div class="hero-background"></div>
            <div class="hero-content">
                <img src="${currentApp.icon}" alt="${currentApp.name}" class="app-icon-hero" loading="lazy">
                <div class="hero-info">
                    <h1 class="hero-title">${currentApp.name}</h1>
                    <p class="hero-description">${currentApp.description}</p>
                    <div class="hero-stats">
                        <div class="stat-badge">
                            <span class="stat-icon">⭐</span>
                            <span class="stat-value">${currentApp.rating || 'N/A'}</span>
                            <span class="stat-label">Rating</span>
                        </div>
                        <div class="stat-badge">
                            <span class="stat-icon">📥</span>
                            <span class="stat-value">${currentApp.downloads || 'N/A'}</span>
                            <span class="stat-label">Downloads</span>
                        </div>
                        <div class="stat-badge">
                            <span class="stat-icon">🏷️</span>
                            <span class="stat-value">${currentApp.category}</span>
                            <span class="stat-label">Category</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="app-content">
            <div class="content-grid">
                <div class="main-content">
                    <section class="content-section">
                        <h2 class="section-title">
                            <span class="title-icon">📱</span>
                            Screenshots
                        </h2>
                        <div class="screenshots-grid">
                            <img src="screenshot/screenshot1" alt="Screenshot 1" loading="lazy" class="screenshot">
                            <img src="screenshot/screenshot2" alt="Screenshot 2" loading="lazy" class="screenshot">
                            <img src="screenshot/screenshot3" alt="Screenshot 3" loading="lazy" class="screenshot">
                            <img src="screenshot/screenshot4" alt="Screenshot 4" loading="lazy" class="screenshot">
                        </div>
                    </section>

                    <section class="content-section">
                        <h2 class="section-title">
                            <span class="title-icon">📋</span>
                            What's New
                        </h2>
                        <div class="changelog-card">
                            <div class="changelog-header">
                                <h3>Latest Update - Version ${currentApp.versions[0]?.version || 'N/A'}</h3>
                                <span class="update-date">${currentApp.versions[0]?.releaseDate || 'N/A'}</span>
                            </div>
                            <ul class="changelog-list">
                                <li>🚀 Improved performance and stability</li>
                                <li>🎨 New user interface enhancements</li>
                                <li>🐛 Bug fixes and optimizations</li>
                                <li>⚡ Faster loading times</li>
                            </ul>
                        </div>
                    </section>

                    <section class="content-section">
                        <h2 class="section-title">
                            <span class="title-icon">💬</span>
                            User Reviews
                        </h2>
                        <div class="review-form-card">
                            <h3>Write a Review</h3>
                            <div class="rating-input">
                                <label>Your Rating:</label>
                                <div class="stars">
                                    <span class="star" data-rating="1">⭐</span>
                                    <span class="star" data-rating="2">⭐</span>
                                    <span class="star" data-rating="3">⭐</span>
                                    <span class="star" data-rating="4">⭐</span>
                                    <span class="star" data-rating="5">⭐</span>
                                </div>
                            </div>
                            <textarea id="review-text" placeholder="Share your experience with this app..." rows="4"></textarea>
                            <button id="submit-review" class="btn btn-primary btn-submit">
                                <span class="btn-icon">📝</span>
                                Submit Review
                            </button>
                        </div>
                        <div class="reviews-container" id="reviews-list">
                            <!-- Reviews will be loaded here -->
                        </div>
                    </section>
                </div>

                <div class="sidebar">
                    <div class="sidebar-card">
                        <h3 class="sidebar-title">
                            <span class="title-icon">⚙️</span>
                            System Requirements
                        </h3>
                        <ul class="requirements-list">
                            <li><span class="req-icon">📱</span> Android 8.0 or higher</li>
                            <li><span class="req-icon">🧠</span> 2GB RAM minimum</li>
                            <li><span class="req-icon">💾</span> 500MB free storage</li>
                            <li><span class="req-icon">🌐</span> Internet connection</li>
                        </ul>
                    </div>

                    <div class="sidebar-card versions-card">
                        <h3 class="sidebar-title">
                            <span class="title-icon">📦</span>
                            Available Versions
                        </h3>
                        ${currentApp.versions.map((version, index) => `
                            <div class="version-card ${index === 0 ? 'latest' : ''}">
                                <div class="version-header">
                                    <span class="version-number">v${version.version}</span>
                                    ${index === 0 ? '<span class="latest-badge">Latest</span>' : ''}
                                </div>
                                <div class="version-meta">
                                    <span class="version-date">${version.releaseDate}</span>
                                    <span class="version-size">${version.size}</span>
                                </div>
                                <button class="btn btn-primary download-btn" data-version="${version.version}">
                                    <span class="btn-icon">⬇️</span>
                                    Download
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add download event listeners
    document.querySelectorAll('.download-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const version = e.target.dataset.version || e.target.closest('.download-btn').dataset.version;
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
    modalText.innerHTML = `
        <div class="modal-icon">📥</div>
        <div class="modal-title">Confirm Download</div>
        <div class="modal-description">Are you sure you want to download <strong>${currentApp.name}</strong> version <strong>${version}</strong>?</div>
    `;

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
// ===============================
// HELPER FUNCTIONS
// ===============================

// Week reset (Sunday)
function getWeekStartSunday() {
  const now = new Date();
  const sunday = new Date(now);
  sunday.setDate(now.getDate() - now.getDay());
  return sunday.toISOString().split('T')[0];
}

// Check permission & limits
async function canUserDownload(user) {
  const weekStart = getWeekStartSunday();

  // Guest user
  if (user.isAnonymous) {
    const joinedAt = user.metadata.creationTime
  ? new Date(user.metadata.creationTime)
  : new Date();
      
    const hoursPassed =
      (Date.now() - joinedAt.getTime()) / (1000 * 60 * 60);

    if (hoursPassed < 24) {
      return {
        allowed: false,
        reason: 'Guest users can download after 24 hours.'
      };
    }

    return { allowed: true, limit: 1, weekStart };
  }

  // Google user
  return { allowed: true, limit: 2, weekStart };
}

// Update user weekly downloads
async function updateUserDownloads(user) {
  const userRef = db.collection('users').doc(user.uid);
  const doc = await userRef.get();
  const weekStart = getWeekStartSunday();

  if (!doc.exists || doc.data().weekStart !== weekStart) {
    await userRef.set({
      isGuest: user.isAnonymous,
      joinedAt: user.metadata.creationTime
  ? new Date(user.metadata.creationTime)
  : firebase.firestore.FieldValue.serverTimestamp(),
      weeklyDownloads: 1,
      weekStart
    }, { merge: true });
  } else {
    await userRef.update({
      weeklyDownloads: firebase.firestore.FieldValue.increment(1)
    });
  }
}

// Update app stats
async function updateAppStats(appId) {
  const appRef = db.collection('apps').doc(appId);
  await appRef.set({
    totalDownloads: firebase.firestore.FieldValue.increment(1)
  }, { merge: true });
}

// ===============================
// MAIN DOWNLOAD FUNCTION
// ===============================
async function handleDownload(version) {
  const user = firebase.auth().currentUser;
  const versionData = currentApp.versions.find(v => v.version === version);

  if (!versionData || !versionData.downloadUrl) {
    showNotification('Download link not available.', 'error');
    return;
  }

  const permission = await canUserDownload(user);
  if (!permission.allowed) {
    showNotification(permission.reason, 'error');
    return;
  }

  const userDoc = await db.collection('users').doc(user.uid).get();
  const used = userDoc.exists ? userDoc.data().weeklyDownloads || 0 : 0;

  if (used >= permission.limit) {
    showNotification(
      `Weekly limit reached (${permission.limit}). Resets on Sunday.`,
      'error'
    );
    return;
  }

  await updateUserDownloads(user);
  await updateAppStats(currentApp.id);

  await db.collection('downloads').add({
    userId: user.uid,
    appId: currentApp.id,
    version,
    date: new Date().toISOString()
  });

  // ✅ REAL DOWNLOAD
  window.location.href = versionData.downloadUrl;

  showNotification(
    `Downloading ${currentApp.name} v${version}...`,
    'success'
  );
}

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

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
        <span class="notification-text">${message}</span>
    `;
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => notification.classList.add('show'), 10);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Back button
document.getElementById('back-btn')?.addEventListener('click', () => {
    window.location.href = 'dashboard.html';
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
            reviewsList.innerHTML = '<div class="no-reviews"><div class="no-reviews-icon">💭</div><p>No reviews yet. Be the first to review this app!</p></div>';
            return;
        }

        reviewsList.innerHTML = reviews.map(review => `
            <div class="review-card">
                <div class="review-header">
                    <div class="reviewer-info">
                        <div class="reviewer-avatar">${(review.author || 'Anonymous').charAt(0).toUpperCase()}</div>
                        <div class="reviewer-details">
                            <span class="reviewer-name">${review.author || 'Anonymous'}</span>
                            <div class="review-rating">
                                ${'⭐'.repeat(review.rating)}
                                <span class="rating-number">${review.rating}/5</span>
                            </div>
                        </div>
                    </div>
                    <span class="review-date">${new Date(review.date).toLocaleDateString()}</span>
                </div>
                <p class="review-text">${review.text}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading reviews:', error);
        reviewsList.innerHTML = '<div class="error">Failed to load reviews.</div>';
    }
}

// Initialize review form
function initReviewForm() {
    // Star rating selection - individual event listeners for each star
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            selectedRating = index + 1;
            updateStarDisplay();
            console.log('Star clicked, rating set to:', selectedRating);
        });
        star.addEventListener('mouseenter', () => {
            // Preview rating on hover
            updateStarDisplay(index + 1);
        });
        star.addEventListener('mouseleave', () => {
            // Reset to selected rating
            updateStarDisplay(selectedRating);
        });
    });

    // Submit review
    document.getElementById('submit-review')?.addEventListener('click', submitReview);
}

// Update star display
function updateStarDisplay(rating = selectedRating) {
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
        if (index < rating) {
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
        showNotification('Please select a rating.', 'error');
        return;
    }

    if (!reviewText) {
        showNotification('Please write a review.', 'error');
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

        showNotification('Review submitted successfully!', 'success');
    } catch (error) {
        console.error('Error submitting review:', error);
        showNotification('Failed to submit review. Please try again.', 'error');
    }
}

// Initialize app detail page
loadAppDetails();





