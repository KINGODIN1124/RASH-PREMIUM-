// Authentication logic
const auth = firebase.auth();

// Check if user is logged in
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/PremiumHub/')) {
            window.location.href = 'dashboard.html';
        }
    } else {
        // User is signed out
        if (!window.location.pathname.includes('index.html') && !window.location.pathname === '/' && !window.location.pathname.endsWith('/PremiumHub/')) {
            window.location.href = 'index.html';
        }
    }
});

// Google Sign In
document.getElementById('google-login')?.addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).then(() => {
        localStorage.setItem('signin_date', new Date().toLocaleDateString());
    }).catch((error) => {
        console.error('Google sign in error:', error);
        alert('Sign in failed. Please try again.');
    });
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
