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
                    <div class="sidebar-card">
  <h3 class="sidebar-title">📊 Download Status</h3>
  <p id="downloads-left">Loading…</p>
  <p id="reset-timer">Loading…</p>
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
        console.log('DOWNLOAD BUTTON CLICKED');

        const button = e.target.closest('.download-btn');
        if (!button) {
            console.error('Button not found');
            return;
        }

        const version = button.dataset.version;
        console.log('Version:', version);

        showDownloadModal(version);
    });
});
    // 🔥 CALL STATUS UPDATE AFTER UI IS READY
setTimeout(updateDownloadStatusUI, 300);

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
function getSundayCountdown() {
  const now = new Date();
  const sunday = new Date(now);
  sunday.setDate(now.getDate() + (7 - now.getDay()) % 7);
  sunday.setHours(0, 0, 0, 0);

  const diff = sunday - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  return `${days}d ${hours}h ${minutes}m`;
}
async function updateDownloadStatusUI() {
  const user = firebase.auth().currentUser;
  if (!user) return;

  const statusEl = document.getElementById('downloads-left');
  const timerEl = document.getElementById('reset-timer');

  const permission = await canUserDownload(user);
  const doc = await db.collection('users').doc(user.uid).get();
  const used = doc.exists ? doc.data().weeklyDownloads || 0 : 0;
  const limit = permission.limit;

  const remaining = Math.max(limit - used, 0);

  statusEl.textContent =
    `Downloads left this week: ${remaining} / ${limit}`;

  timerEl.textContent =
    `Resets in: ${getSundayCountdown()}`;

  if (Number.isFinite(remaining) && remaining === 0) {
    document.querySelectorAll('.download-btn').forEach(btn => {
      btn.disabled = true;
      btn.textContent = 'Limit Reached';
      btn.classList.add('disabled');
    });
  }
    else {
  document.querySelectorAll('.download-btn').forEach(btn => {
    btn.disabled = false;
    btn.textContent = 'Download';
    btn.classList.remove('disabled');
  });
    }
}

// ===============================
// MAIN DOWNLOAD FUNCTION
// ===============================
async function handleDownload(version) {
  const user = firebase.auth().currentUser;
  const versionData = currentApp.versions.find(v => v.version === version);

  const downloadURL =
    versionData?.downloadLink ||
    versionData?.downloadUrl ||
    versionData?.link ||
    versionData?.url;

  if (!downloadURL) {
    showNotification('Download link not available.', 'error');
    return;
  }

  // 🔐 Permission check (BEFORE navigation, but NO awaits after)
  const permission = await canUserDownload(user);
  if (!permission.allowed) {
    showNotification(permission.reason, 'error');
    return;
  }

  const userRef = db.collection('users').doc(user.uid);
  const snap = await userRef.get();
  const used = snap.exists ? snap.data().weeklyDownloads || 0 : 0;

  if (used >= permission.limit) {
    showNotification(
      `Weekly limit reached (${permission.limit}). Resets on Sunday.`,
      'error'
    );
    return;
  }

  /* ===============================
     ✅ MOBILE-SAFE DOWNLOAD (CRITICAL)
  ================================ */
  const a = document.createElement('a');
  a.href = downloadURL;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  /* ===============================
     🔄 BACKGROUND UPDATES (ASYNC)
  ================================ */
  updateUserDownloads(user);
  updateAppStats(currentApp.id);

  db.collection('downloads').add({
    userId: user.uid,
    appId: currentApp.id,
    version,
    date: new Date().toISOString()
  });

  showNotification(
    `Downloading ${currentApp.name} v${version}...`,
    'success'
  );

  setTimeout(updateDownloadStatusUI, 500);
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
  const reviewsList = document.getElementById('reviews-list');
  reviewsList.innerHTML = 'Loading reviews...';

  try {
    const querySnapshot = await db
      .collection('reviews')
      .where('appId', '==', appId)
      .get();

    let reviews = [];

    querySnapshot.forEach(doc => {
      reviews.push({
        id: doc.id,
        ...doc.data()
      });
    });
            // Sort latest first
    reviews.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (reviews.length === 0) {
      reviewsList.innerHTML = `
        <div class="no-reviews">
          <div class="no-reviews-icon">💭</div>
          <p>No reviews yet. Be the first to review this app!</p>
        </div>
      `;
      return;
    }

    const currentUser = firebase.auth().currentUser;
        reviewsList.innerHTML = reviews.map(review => `
      <div class="review-card">
        <div class="review-header">
          <div class="reviewer-info">
            <div class="reviewer-avatar">
              ${(review.author || 'U')[0].toUpperCase()}
            </div>
            <div>
              <strong>${review.author}</strong>
              <div class="review-rating">
                ${'⭐'.repeat(review.rating)}
              </div>
            </div>
          </div>

      ${
            currentUser?.uid === review.userId
              ? `
                <div class="review-actions">
                  <button onclick="editReview('${review.id}', '${review.text.replace(/'/g, "\\'")}', ${review.rating})">✏️</button>
                  <button onclick="deleteReview('${review.id}')">🗑</button>
                </div>
              `
              : ''
          }
        </div>

    <p class="review-text">${review.text}</p>
      </div>
    `).join('');

  } catch (error) {
    console.error('Error loading reviews:', error);
    reviewsList.innerHTML =
      '<div class="error">Failed to load reviews.</div>';
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

if (!user || user.isAnonymous) {
  showNotification(
    'Please sign in with Google to submit a review.',
    'error'
  );
  return;
}
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
        showNotification(
  'Review failed. Please check your internet connection.',
  'error'
);
    }
}

async function editReview(reviewId, text, rating) {
  const newText = prompt('Edit your review:', text);
  if (!newText || !newText.trim()) return;

  try {
    await db.collection('reviews').doc(reviewId).update({
      text: newText.trim(),
      rating: rating,
      date: new Date().toISOString()
    });

    showNotification('Review updated successfully!', 'success');
    loadReviews();
  } catch (error) {
    console.error(error);
    showNotification('Failed to update review.', 'error');
  }
}

async function deleteReview(reviewId) {
  const confirmDelete = confirm('Delete this review permanently?');
  if (!confirmDelete) return;

  try {
    await db.collection('reviews').doc(reviewId).delete();
    showNotification('Review deleted.', 'success');
    loadReviews();
  } catch (error) {
    console.error(error);
    showNotification('Failed to delete review.', 'error');
  }
}

// Initialize app detail page
loadAppDetails();


