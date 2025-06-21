// DOM Elements
const cartBtn = document.getElementById('cart-btn');
const cartOverlay = document.querySelector('.cart-overlay');
const closeCart = document.querySelector('.close-cart');
const cartContent = document.getElementById('cart-content');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const productContainer = document.getElementById('product-container');

// Cart
let cart = [];

// Fetch products from JSON file
async function fetchProducts() {
    try {
        const response = await fetch('products.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Display products
async function displayProducts() {
    const products = await fetchProducts();
    
    if (products) {
        let output = '';
        products.forEach(product => {
            output += `
                <div class="product-card">
                    <img src="${product.image}" alt="${product.name}" class="product-img">
                    <div class="product-info">
                        <h3 class="product-title">${product.name}</h3>
                        <p class="product-price">$${product.price}</p>
                        <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                    </div>
                </div>
            `;
        });
        productContainer.innerHTML = output;
    }
}

// Add to cart
function addToCart(id) {
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        // Increase quantity
        existingItem.quantity += 1;
    } else {
        // Add new item to cart
        const product = getProductById(id);
        if (product) {
            cart.push({
                ...product,
                quantity: 1
            });
        }
    }
    
    updateCart();
}

// Get product by ID
async function getProductById(id) {
    const products = await fetchProducts();
    return products.find(product => product.id === id);
}

// Remove from cart
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

// Update cart UI
function updateCart() {
    // Update cart items
    let output = '';
    let total = 0;
    
    cart.forEach(item => {
        total += item.price * item.quantity;
        output += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-info">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <p class="cart-item-price">$${item.price} x ${item.quantity}</p>
                    <span class="remove-item" data-id="${item.id}">Remove</span>
                </div>
            </div>
        `;
    });
    
    cartContent.innerHTML = output || '<p>Your cart is empty</p>';
    cartTotal.textContent = total.toFixed(2);
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}

// Event Listeners
// Open cart
cartBtn.addEventListener('click', (e) => {
    e.preventDefault();
    cartOverlay.style.display = 'flex';
});

// Close cart
closeCart.addEventListener('click', () => {
    cartOverlay.style.display = 'none';
});

// Close cart when clicking outside
cartOverlay.addEventListener('click', (e) => {
    if (e.target === cartOverlay) {
        cartOverlay.style.display = 'none';
    }
});

// Add to cart button
productContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart')) {
        const id = parseInt(e.target.getAttribute('data-id'));
        addToCart(id);
    }
});

// Remove item from cart
cartContent.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-item')) {
        const id = parseInt(e.target.getAttribute('data-id'));
        removeFromCart(id);
    }
});

// Initialize
displayProducts();
loadCart();