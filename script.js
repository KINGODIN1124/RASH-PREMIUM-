// =============================================================
// FINAL app.js — MOBILE SAFE, GOOGLE REDIRECT LOGIN, STABLE
// =============================================================

// ----------------- FIREBASE CONFIG -----------------
const firebaseConfig = {
  apiKey: "AIzaSyC2k8pfLN7GsHRjR0TjA7XWbv1gAu-Yy1Q",
  authDomain: "rash-premium.firebaseapp.com",
  projectId: "rash-premium",
  storageBucket: "rash-premium.firebasestorage.app",
  messagingSenderId: "707837381992",
  appId: "1:707837381992:web:da27c427cef2a0d0315add"
};

const WEEKLY_LIMIT = 5;

// ----------------- GLOBALS -----------------
let auth, firestore, currentUser;
let allAppsData = null;

// ----------------- INIT FIREBASE -----------------
async function initFirebase() {
  const base = "https://www.gstatic.com/firebasejs/10.12.2";

  const { initializeApp } = await import(`${base}/firebase-app.js`);
  const {
    getAuth,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithRedirect,
    getRedirectResult,
    signInAnonymously,
    signOut
  } = await import(`${base}/firebase-auth.js`);
  const {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    increment,
    collection,
    addDoc,
    serverTimestamp
  } = await import(`${base}/firebase-firestore.js`);

  initializeApp(firebaseConfig);
  auth = getAuth();
  firestore = getFirestore();

  // ----- Handle Google redirect result (MOBILE SAFE) -----
  getRedirectResult(auth)
    .then((result) => {
      if (result?.user) {
        location.href = "dashboard.html";
      }
    })
    .catch((err) => {
      alert("Login error: " + err.message);
    });

  // ----- Auth state -----
  onAuthStateChanged(auth, (user) => {
    currentUser = user || null;
    updateUserUI();
  });

  // ----- BUTTONS -----
  const googleBtn = document.getElementById("googleLoginBtn");
  const guestBtn = document.getElementById("guestLoginBtn");

  if (googleBtn) {
    googleBtn.onclick = async () => {
      const provider = new GoogleAuthProvider();
      await signInWithRedirect(auth, provider);
    };
  }

  if (guestBtn) {
    guestBtn.onclick = async () => {
      await signInAnonymously(auth);
      location.href = "dashboard.html";
    };
  }

  // ----- PAGE ROUTING -----
  const page = location.pathname.split("/").pop();

  if (page === "dashboard.html") {
    await loadApps();
    setupSearch();
  }

  if (page === "app_detail.html") {
    await loadApps();
    renderAppDetail();
  }
}

// ----------------- WEEK HANDLING (FIXED) -----------------
function getWeekStart() {
  const today = new Date();
  const day = today.getDay() || 7;
  const monday = new Date(today);
  monday.setDate(today.getDate() - day + 1);
  return monday.toISOString().split("T")[0];
}

// ----------------- DOWNLOAD LIMIT -----------------
async function getUserDoc() {
  if (!currentUser) return null;

  const ref = doc(firestore, "users", currentUser.uid);
  const snap = await getDoc(ref);
  const weekStart = getWeekStart();

  if (!snap.exists() || snap.data().weekStart !== weekStart) {
    await setDoc(ref, { downloadsThisWeek: 0, weekStart });
    return { downloadsThisWeek: 0 };
  }

  return snap.data();
}

async function canDownload() {
  if (!currentUser) return true;
  const data = await getUserDoc();
  return data.downloadsThisWeek < WEEKLY_LIMIT;
}

async function incrementDownload() {
  if (!currentUser) return;
  const ref = doc(firestore, "users", currentUser.uid);
  await updateDoc(ref, { downloadsThisWeek: increment(1) });
}

// ----------------- DATA -----------------
async function loadApps() {
  const res = await fetch("data.json");
  allAppsData = await res.json();
  renderDashboard(allAppsData);
}

function renderDashboard(apps) {
  const grid = document.getElementById("app-grid-container");
  if (!grid) return;

  grid.innerHTML = "";
  apps.forEach(app => {
    grid.innerHTML += `
      <a class="link-card" href="app_detail.html?id=${app.id}">
        <div class="icon"><img src="${app.icon}"></div>
        <div class="details">
          <h3>${app.name}</h3>
          <p>${app.category}</p>
        </div>
      </a>
    `;
  });
}

// ----------------- SEARCH -----------------
function setupSearch() {
  const input = document.getElementById("app-search");
  if (!input) return;

  input.oninput = () => {
    const q = input.value.toLowerCase();
    renderDashboard(
      allAppsData.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
      )
    );
  };
}

// ----------------- DETAIL PAGE -----------------
function renderAppDetail() {
  const id = new URLSearchParams(location.search).get("id");
  const app = allAppsData.find(a => a.id === id);
  if (!app) return;

  document.getElementById("detail-app-name").textContent = app.name;
  document.getElementById("detail-app-icon").src = app.icon;

  const list = document.getElementById("version-list-container");
  list.innerHTML = "";

  app.versions.forEach(v => {
    list.innerHTML += `
      <div class="version-card">
        <div>
          <h4>${v.versionNumber}</h4>
          <p>${v.uploadDate}</p>
        </div>
        <button class="download-button"
          data-link="${v.downloadLink}"
          data-app="${app.name}"
          data-version="${v.versionNumber}">
          Download
        </button>
      </div>
    `;
  });

  document.querySelectorAll(".download-button").forEach(btn => {
    btn.onclick = () => confirmDownload(
      btn.dataset.link,
      btn.dataset.app,
      btn.dataset.version
    );
  });
}

// ----------------- MODAL + DOWNLOAD -----------------
async function confirmDownload(link, appName, version) {
  const modal = document.getElementById("downloadModal");
  modal.style.display = "flex";

  document.getElementById("cancelDownload").onclick = () => {
    modal.style.display = "none";
  };

  document.getElementById("confirmDownload").onclick = async () => {
    modal.style.display = "none";

    if (!(await canDownload())) {
      alert("Weekly limit reached");
      return;
    }

    await incrementDownload();
    window.open(link, "_blank");
  };
}

// ----------------- USER UI -----------------
function updateUserUI() {
  const box = document.getElementById("user-dashboard-info");
  if (!box) return;

  if (currentUser) {
    box.innerHTML = `
      <div>
        <strong>${currentUser.displayName || "Guest"}</strong><br>
        ${currentUser.email || ""}
      </div>
    `;
  } else {
    box.innerHTML = `<a href="index.html">Sign in</a>`;
  }
}

// ----------------- THEME -----------------
function toggleTheme() {
  document.body.classList.toggle("light-mode");
}

// ----------------- START -----------------
initFirebase();
