let productsData = [];

// Load products data
async function loadProducts() {
    try {
        const response = await fetch('products.json'); // Ensure the path is correct
        if (!response.ok) throw new Error('Failed to load products');
        productsData = await response.json();
    } catch (err) {
        console.error('Error loading product data:', err);
    }
}

function initScanner() {
    const scanBtn = document.getElementById('scanBtn');
    const brandSearch = document.getElementById('brandSearch');
    const resultContainer = document.getElementById('resultContainer');
    const loadingIndicator = document.getElementById('loadingIndicator');

    loadProducts();

    const handleScan = () => {
        const searchTerm = brandSearch.value.trim().toLowerCase();
        if (!searchTerm) {
            resultContainer.innerHTML = `<p>Please enter a brand name.</p>`;
            return;
        }

        resultContainer.innerHTML = '';
        loadingIndicator.style.display = 'block';

        setTimeout(() => {
            const found = productsData.find(p =>
                p.brand.toLowerCase() === searchTerm ||
                p.brand.toLowerCase().includes(searchTerm)
            );

            loadingIndicator.style.display = 'none';

            if (found) showResult(found);
            else showNotFound(searchTerm);
        }, 1200);
    };

    function showResult(product) {
        const card = document.createElement("div");
        card.className = `result-card ${product.isIsraeli ? 'boycott' : 'safe'}`;

        card.innerHTML = `
            <h3>${product.brand}</h3>
            <p><strong>Status:</strong> ${product.isIsraeli ? '❌ BOYCOTT' : '✅ SAFE'}</p>
            <p>${product.notes || 'No additional notes available.'}</p>
        `;

        resultContainer.appendChild(card);
    }

    function showNotFound(brand) {
        const card = document.createElement("div");
        card.className = "result-card";

        card.innerHTML = `
            <h3>❓ "${brand}"</h3>
            <p>No data found. Check spelling or try another brand.</p>
        `;

        resultContainer.appendChild(card);
    }

    scanBtn.addEventListener('click', handleScan);
    brandSearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleScan();
    });

    // Taskbar functionality
    document.getElementById('streakBtn').addEventListener('click', () => {
        window.location.href = 'streak.htm';
    });

    document.getElementById('hadithBtn').addEventListener('click', () => {
        window.location.href = 'hadith.htm';
    });

    document.getElementById('namazBtn').addEventListener('click', () => {
        window.location.href = 'namaz.htm';
    });
}

window.addEventListener('load', initScanner);

