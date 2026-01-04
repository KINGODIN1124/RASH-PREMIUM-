// Admin panel functionality
let apps = [];

// Check if user is admin (for now, any logged-in user can access)
firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
        window.location.href = 'index.html';
    } else {
        loadApps();
        initAdminForm();
    }
});

// Load existing apps
async function loadApps() {
    try {
        const response = await fetch('data/apps.json');
        apps = await response.json();
        renderAppsList();
    } catch (error) {
        console.error('Error loading apps:', error);
    }
}

// Render apps list
function renderAppsList() {
    const appsList = document.getElementById('apps-list');
    appsList.innerHTML = apps.map(app => `
        <div class="admin-app-item">
            <div class="app-info">
                <h4>${app.name}</h4>
                <p>${app.description.substring(0, 100)}...</p>
                <small>Category: ${app.category} | Versions: ${app.versions.length}</small>
            </div>
            <div class="app-actions">
                <button class="btn btn-secondary edit-app" data-id="${app.id}">Edit</button>
                <button class="btn btn-secondary delete-app" data-id="${app.id}">Delete</button>
            </div>
        </div>
    `).join('');
}

// Initialize admin form
function initAdminForm() {
    // Add version button
    document.getElementById('add-version').addEventListener('click', addVersionField);

    // Form submission
    document.getElementById('app-form').addEventListener('submit', handleAppSubmit);

    // Clear form
    document.getElementById('clear-form').addEventListener('click', clearForm);

    // Back button
    document.getElementById('back-btn').addEventListener('click', () => {
        window.location.href = 'dashboard.html';
    });
}

// Add version field
function addVersionField() {
    const container = document.getElementById('versions-container');
    const versionDiv = document.createElement('div');
    versionDiv.className = 'version-input';
    versionDiv.innerHTML = `
        <input type="text" placeholder="Version (e.g., 1.0.0)" class="version-number">
        <input type="date" class="version-date">
        <input type="text" placeholder="Size (e.g., 45MB)" class="version-size">
        <button type="button" class="btn btn-secondary remove-version">Remove</button>
    `;

    // Add remove functionality
    versionDiv.querySelector('.remove-version').addEventListener('click', () => {
        versionDiv.remove();
    });

    container.appendChild(versionDiv);
}

// Handle app submission
async function handleAppSubmit(e) {
    e.preventDefault();

    const appData = {
        id: generateAppId(),
        name: document.getElementById('app-name').value.trim(),
        title: document.getElementById('app-title').value.trim(),
        description: document.getElementById('app-description').value.trim(),
        category: document.getElementById('app-category').value,
        icon: document.getElementById('app-icon').value.trim(),
        requirements: [
            document.getElementById('req-android').value.trim(),
            document.getElementById('req-ram').value.trim(),
            document.getElementById('req-storage').value.trim(),
            document.getElementById('req-internet').value.trim()
        ].filter(req => req),
        screenshots: [
            document.getElementById('screenshot1').value.trim(),
            document.getElementById('screenshot2').value.trim(),
            document.getElementById('screenshot3').value.trim()
        ].filter(screenshot => screenshot),
        versions: getVersionsData()
    };

    // Validate required fields
    if (!appData.name || !appData.title || !appData.description || !appData.category || !appData.icon || appData.versions.length === 0) {
        alert('Please fill in all required fields and add at least one version.');
        return;
    }

    try {
        // Add to apps array
        apps.push(appData);

        // Save to local file (in a real app, this would be saved to a database)
        // For demo purposes, we'll just update the local array
        console.log('New app added:', appData);

        // Clear form
        clearForm();

        // Reload apps list
        renderAppsList();

        alert('App added successfully!');
    } catch (error) {
        console.error('Error adding app:', error);
        alert('Failed to add app. Please try again.');
    }
}

// Get versions data
function getVersionsData() {
    const versionInputs = document.querySelectorAll('.version-input');
    const versions = [];

    versionInputs.forEach(input => {
        const version = input.querySelector('.version-number').value.trim();
        const date = input.querySelector('.version-date').value;
        const size = input.querySelector('.version-size').value.trim();

        if (version && date && size) {
            versions.push({
                version: version,
                releaseDate: date,
                size: size,
                downloadUrl: '#'
            });
        }
    });

    return versions;
}

// Generate unique app ID
function generateAppId() {
    return 'app' + Date.now();
}

// Clear form
function clearForm() {
    document.getElementById('app-form').reset();
    document.getElementById('versions-container').innerHTML = `
        <div class="version-input">
            <input type="text" placeholder="Version (e.g., 1.0.0)" class="version-number">
            <input type="date" class="version-date">
            <input type="text" placeholder="Size (e.g., 45MB)" class="version-size">
            <button type="button" class="btn btn-secondary remove-version">Remove</button>
        </div>
    `;

    // Re-add remove functionality to the default version
    document.querySelector('.remove-version').addEventListener('click', function() {
        this.parentElement.remove();
    });
}
