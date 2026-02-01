const productListElement = document.getElementById('product-list');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const suggestionBox = document.getElementById('suggestions');

let allProducts = [];
let filteredProducts = [];
let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

const itemsPerPage = 12;
let currentPage = 1;

function getQueryList() {
    return searchHistory.map(item => item.query);
}

async function fetchProducts(limit = 30) {
    try {
        const response = await fetch(`https://dummyjson.com/products?limit=${limit}`);
        const data = await response.json();

        allProducts = data.products;
        displayProducts(allProducts);

        const params = new URLSearchParams(window.location.search);
        const searchQuery = params.get('search');
        if (searchQuery) {
            searchInput.value = decodeURIComponent(searchQuery);
            searchButton.click();
        }

    } catch (error) {
        console.error('Error fetching products:', error);
        productListElement.innerHTML = '<p>Failed to load products.</p>';
    }
}

function displayProducts(products) {
    filteredProducts = products;
    currentPage = 1;
    displayPage(currentPage);
}

function displayPage(page) {
    productListElement.innerHTML = '';
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const productsToShow = filteredProducts.slice(start, end);

    productsToShow.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        productCard.innerHTML = `
            <img src="${product.thumbnail}" alt="${product.title}">
            <h2>${product.title}</h2>
            <p>₹ ${product.price.toFixed(2)}</p>
        `;

        productListElement.appendChild(productCard);

        productCard.addEventListener('click', () => {
            const viewHistory = JSON.parse(localStorage.getItem('viewHistory')) || [];
            viewHistory.push({
                title: product.title,
                productId: product.id,
                time: Date.now()
            });
            localStorage.setItem('viewHistory', JSON.stringify(viewHistory));
            window.location.href = `product_details.html?id=${product.id}`;
        });
    });

    renderPagination();
}

function renderPagination() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('a');
        btn.textContent = i;
        btn.className = i === currentPage ? 'active' : '';
        btn.onclick = () => {
            currentPage = i;
            displayPage(currentPage);
            window.scrollTo(0, 0);
        };
        pagination.appendChild(btn);
    }

    document.getElementById('current-page').textContent = currentPage;
    document.getElementById('total-pages').textContent = totalPages;
}

function saveSearch(term) {
    const exists = searchHistory.some(item => item.query === term);
    
    if (!exists) {
        const historyEntry = {
            query: term,
            time: Date.now()
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

fetchProducts();

searchInput.addEventListener('input', showSuggestions);

fetchProducts(200);
