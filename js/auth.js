// Authentication logic
const auth = firebase.auth();

const MAINTENANCE_MODE = true; // 🔴 toggle ON/OFF
const OWNER_EMAIL = 'tripathi.shashwat133@gmail.com';

firebase.auth().onAuthStateChanged(user => {
  const path = window.location.pathname;

  // 🔧 Maintenance mode routing
  if (MAINTENANCE_MODE) {
    if (
      user &&
      user.email === OWNER_EMAIL &&
      user.emailVerified
    ) {
      // Owner allowed
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

  // 🔓 Normal mode routing
  if (user) {
    if (path.includes('index.html') || path === '/') {
      window.location.replace('dashboard.html');
    }
  } else {
    if (!path.includes('index.html')) {
      window.location.replace('index.html');
    }
  }
});

// Google Sign In
document.getElementById('google-login')?.addEventListener('click', async () => {
    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        // Add additional scopes if needed
        provider.addScope('email');
        provider.addScope('profile');

        const result = await auth.signInWithPopup(provider);
        localStorage.setItem('signin_date', new Date().toLocaleDateString());

        console.log('Google sign in successful:', result.user.displayName);
    } catch (error) {
        console.error('Google sign in error:', error);

        // Provide more specific error messages
        let errorMessage = 'Sign in failed. ';
        switch (error.code) {
            case 'auth/popup-blocked':
                errorMessage += 'Popup was blocked by browser. Please allow popups and try again.';
                break;
            case 'auth/popup-closed-by-user':
                errorMessage += 'Sign in was cancelled.';
                break;
            case 'auth/cancelled-popup-request':
                errorMessage += 'Another sign in popup is already open.';
                break;
            case 'auth/account-exists-with-different-credential':
                errorMessage += 'Account exists with different sign in method.';
                break;
            case 'auth/unauthorized-domain':
                errorMessage += 'This domain is not authorized for sign in. Please contact support.';
                break;
            default:
                errorMessage += 'Please check your internet connection and try again.';
        }

        alert(errorMessage);
    }
});

// Guest Sign In (Anonymous)
document.getElementById('guest-login')?.addEventListener('click', () => {
    auth.signInAnonymously().then(() => {
        localStorage.setItem('signin_date', new Date().toLocaleDateString());
    }).catch((error) => {
        console.error('Anonymous sign in error:', error);
        alert('Guest access failed. Please try again.');
    });
});

// Logout
document.getElementById('logout')?.addEventListener('click', () => {
    auth.signOut().then(() => {
        window.location.href = 'index.html';
    });
});

// Theme toggle
document.getElementById('theme-toggle')?.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    updateThemeIcon();
});

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
}
updateThemeIcon();

function updateThemeIcon() {
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
        toggle.textContent = document.body.classList.contains('light-mode') ? '☀️' : '🌙';
    }
}

