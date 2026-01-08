// js/router.js
// ===============================
// CENTRAL ROUTER (ONLY REDIRECTS)
// ===============================

const OWNER_EMAIL = 'tripathi.shashwat133@gmail.com';
const MAINTENANCE_MODE = true; // 🔴 toggle here only

firebase.auth().onAuthStateChanged(user => {
  const path = window.location.pathname;

  /* ===============================
     MAINTENANCE MODE
  ================================ */
  if (MAINTENANCE_MODE) {
    if (
      user &&
      user.email === OWNER_EMAIL &&
      user.emailVerified
    ) {
      // Owner allowed only dashboard
      if (!path.includes('dashboard.html')) {
        window.location.replace('dashboard.html');
      }
    } else {
      // Everyone else → maintenance
      if (!path.includes('maintenance.html')) {
        window.location.replace('maintenance.html');
      }
    }
    return;
  }

  /* ===============================
     NORMAL MODE
  ================================ */
  if (user) {
    if (path.includes('index.html') || path === '/') {
      window.location.replace('dashboard.html');
    }
  } else {
    if (
      path.includes('dashboard.html') ||
      path.includes('app-detail.html')
    ) {
      window.location.replace('index.html');
    }
  }
});
