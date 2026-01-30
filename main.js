let allProducts = [];
const productListElement = document.getElementById('product-list');
async function fetchProducts() {
    try {
        const response = await fetch('https://dummyjson.com/products');
        const data = await response.json();

        allProducts = data.products;   // store globally
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
fetchProducts();
document.getElementById('search-button').addEventListener('click', () => {
    const searchTerm = document.getElementById('search-input').value;
    
});
document.getElementById('search-button').addEventListener('click', () => {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();

    const filteredProducts = allProducts.filter(product =>
        product.title.toLowerCase().includes(searchTerm)
    );

    displayProducts(filteredProducts);
});