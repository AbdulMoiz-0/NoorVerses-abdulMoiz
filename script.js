// ==================== PASSWORD TOGGLE ====================
document.getElementById('togglePassword').addEventListener('click', function () {
    const passwordInput = document.getElementById('password');
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);

    // Toggle the eye icon
    this.classList.toggle('fa-eye');
    this.classList.toggle('fa-eye-slash');
});

// ==================== AUTHENTICATION LOGIC ====================

document.addEventListener('DOMContentLoaded', function () {
    const storedUsername = localStorage.getItem('username');
    const loggedIn = localStorage.getItem('loggedIn') === 'true';

    setupNavigation();

    if (loggedIn && storedUsername) {
        showDashboard();
        initializeScanner();
    }

    if (loggedIn && storedUsername) {
        // Redirect to scanner.htm if already logged in
        window.location.href = 'scanner.htm';
    }
});

document.getElementById('loginForm')?.addEventListener('submit', function (e) {
    e.preventDefault();

    const usernameInput = document.getElementById('username').value.trim();
    const passwordInput = document.getElementById('password').value.trim();

    if (!usernameInput || !passwordInput) {
        alert('Please fill in both username and password.');
        return;
    }

    if (passwordInput.length < 6) {
        alert('Password must be at least 6 characters.');
        return;
    }

    let savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = savedUsers.find(user => user.username === usernameInput);

    if (!existingUser) {
        // First-time user – save and allow
        savedUsers.push({ username: usernameInput, password: passwordInput });
        localStorage.setItem('users', JSON.stringify(savedUsers));
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('username', usernameInput);
        alert('Account created successfully! Redirecting to scanner...');
        window.location.href = 'scanner.htm'; // Redirect to scanner.htm
        return;
    }

    if (existingUser.password === passwordInput) {
        // Correct password
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('username', usernameInput);
        alert('Login successful! Redirecting to scanner...');
        window.location.href = 'scanner.htm'; // Redirect to scanner.htm
    } else {
        // Incorrect password
        alert('Incorrect username or password. Please try again.');
    }
});

// ==================== DASHBOARD & NAVIGATION ====================

function showDashboard() {
    const loginContainer = document.querySelector('.login-container');
    const dashboardContainer = document.querySelector('.dashboard-container');
    
    loginContainer?.classList.remove('active');
    if (dashboardContainer) {
        dashboardContainer.classList.add('active');
        dashboardContainer.style.display = 'block';
    }

    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelector('#scanner')?.classList.add('active');

    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
    document.querySelector('.nav-links a[href="#scanner"]')?.classList.add('active');
}

function setupNavigation() {
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const pageId = this.getAttribute('href').substring(1);

            document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

            this.classList.add('active');
            document.getElementById(pageId)?.classList.add('active');
        });
    });
}

// ==================== SCANNER FUNCTIONALITY ====================

function initializeScanner() {
    const scanBtn = document.getElementById('scanBtn');
    const brandSearch = document.getElementById('brandSearch');
    const resultContainer = document.getElementById('resultContainer');
    const loadingIndicator = document.getElementById('loading');

    if (scanBtn && brandSearch) {
        scanBtn.addEventListener('click', async function () {
            const searchTerm = brandSearch.value.trim();

            if (!searchTerm) {
                alert('Please enter a product or brand name.');
                return;
            }

            loadingIndicator.style.display = 'block';
            resultContainer.innerHTML = '';

            try {
                const response = await fetch('products.json');
                const data = await response.json();

                await new Promise(resolve => setTimeout(resolve, 800)); // Optional delay for realism

                const isIsraeli = data.israeli_products.some(product =>
                    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.brand.toLowerCase().includes(searchTerm.toLowerCase())
                );

                displayResult(isIsraeli, searchTerm);
            } catch (error) {
                console.error('Error loading product database:', error);
                resultContainer.innerHTML = `
                    <div class="result-card error">
                        <h3>Error</h3>
                        <p>Failed to check product. Please try again later.</p>
                    </div>
                `;
            } finally {
                loadingIndicator.style.display = 'none';
            }
        });
    }
}

function displayResult(isIsraeli, searchTerm) {
    const resultContainer = document.getElementById('resultContainer');

    resultContainer.innerHTML = isIsraeli
        ? `
            <div class="result-card boycott">
                <h3>Boycott Alert!</h3>
                <p>The product/brand "${searchTerm}" is associated with Israel.</p>
                <p>Consider alternatives to support Palestinian rights.</p>
            </div>
        `
        : `
            <div class="result-card safe">
                <h3>Product Clear</h3>
                <p>The product/brand "${searchTerm}" is not in our database of Israeli products.</p>
                <p>Note: Our database may not be complete. Please verify independently if unsure.</p>
            </div>
        `;
}






