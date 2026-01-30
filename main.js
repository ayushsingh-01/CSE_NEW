const productListElement = document.getElementById('product-list');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const suggestionBox = document.getElementById('suggestions');

let allProducts = [];
// Load raw history as an array of objects
let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

// If you need a simple list for suggestions, map the queries out
function getQueryList() {
    return searchHistory.map(item => item.query);
}

async function fetchProducts(limit = 30) {
    try {
        const response = await fetch(`https://dummyjson.com/products?limit=${limit}`);
        const data = await response.json();

        allProducts = data.products;
        displayProducts(allProducts);
    } catch (error) {
        console.error('Error fetching products:', error);
        productListElement.innerHTML = '<p>Failed to load products.</p>';
    }
}

function displayProducts(products) {
    productListElement.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        productCard.innerHTML = `
            <img src="${product.thumbnail}" alt="${product.title}">
            <h2>${product.title}</h2>
            <p>₹ ${product.price.toFixed(2)}</p>
        `;

        productListElement.appendChild(productCard);
    });
}

function saveSearch(term) {
    // Check if the query already exists in our history objects
    const exists = searchHistory.some(item => item.query === term);
    
    if (!exists) {
        const historyEntry = {
            query: term,
            time: Date.now() // Returns timestamp like 1769745730266
        };
        
        searchHistory.push(historyEntry);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }
}


function showSuggestions() {
    const inputValue = searchInput.value.trim().toLowerCase();
    suggestionBox.innerHTML = '';
    if (!inputValue) return;

    // Filter based on the query property of each object
    const matched = searchHistory.filter(item => 
        item.query.toLowerCase().startsWith(inputValue)
    );

    matched.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item.query; // Display the query string
        li.onclick = () => {
            searchInput.value = item.query;
            suggestionBox.innerHTML = '';
        };
        suggestionBox.appendChild(li);
    });
}


searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value.trim().toLowerCase();

    if (searchTerm === '') {
        displayProducts(allProducts);
        suggestionBox.innerHTML = '';
        return;
    }

    saveSearch(searchTerm);
    suggestionBox.innerHTML = '';

    const filtered = allProducts.filter(product =>
        product.title.toLowerCase().includes(searchTerm)
    );

    displayProducts(filtered);
});

searchInput.addEventListener('input', showSuggestions);

fetchProducts(250);
