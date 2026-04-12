const CART_KEY = 'chingzing_cart';
const cartCount = document.getElementById('cart-count');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Elements
const previewImage = document.getElementById('preview-image');
const previewTitle = document.getElementById('preview-title');
const previewCuisines = document.getElementById('preview-cuisines');
const previewRating = document.getElementById('preview-rating');
const previewTime = document.getElementById('preview-time');
const previewPrice = document.getElementById('preview-price');
const previewOldPrice = document.getElementById('preview-old-price');
const qtyDisplay = document.getElementById('qty-display');
const qtyMinus = document.getElementById('qty-minus');
const qtyPlus = document.getElementById('qty-plus');
const addToCartBtn = document.getElementById('add-to-cart-btn');

let currentProduct = null;
let quantity = 1;

// Hamburger menu toggle
if (hamburger) {
  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCount) {
    cartCount.textContent = totalItems;
  }
}

function loadProductFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  
  const id = urlParams.get('id');
  const title = urlParams.get('title');
  // Handle case where title might be missing or short
  if (!id || !title) {
    window.location.href = '../Home_Page/home.html';
    return;
  }

  const image = urlParams.get('image') || 'https://via.placeholder.com/600x400?text=Food';
  const priceStr = urlParams.get('price');
  let price = parseInt(priceStr);
  if (isNaN(price)) price = Math.floor(Math.random() * 300) + 150; // default realistic price if not provided

  const cuisines = urlParams.get('cuisines') || 'Multi-Cuisine';
  const ratingStr = urlParams.get('rating');
  const rating = ratingStr && !isNaN(parseFloat(ratingStr)) ? parseFloat(ratingStr).toFixed(1) : (Math.random() * 2 + 3).toFixed(1);
  const time = urlParams.get('time') || '30';

  currentProduct = { id, title, image, price, cuisines, rating, time };

  // Update UI
  previewImage.src = image;
  previewTitle.textContent = title;
  previewCuisines.textContent = cuisines;
  previewPrice.textContent = price;
  previewOldPrice.textContent = `₹${Math.floor(price * 1.3)}`; // Faux old price
  previewRating.textContent = rating;
  previewTime.textContent = `${time} mins`;
}

qtyMinus.addEventListener('click', () => {
  if (quantity > 1) {
    quantity--;
    qtyDisplay.textContent = quantity;
  }
});

qtyPlus.addEventListener('click', () => {
  if (quantity < 10) {
    quantity++;
    qtyDisplay.textContent = quantity;
  }
});

addToCartBtn.addEventListener('click', () => {
  if (!currentProduct) return;

  const cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  
  const existingItemIndex = cart.findIndex(item => String(item.id) === String(currentProduct.id));
  
  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += quantity;
  } else {
    cart.push({
      id: currentProduct.id,
      title: currentProduct.title,
      price: currentProduct.price,
      image: currentProduct.image,
      quantity: quantity
    });
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
  
  // Show a little animation or alert
  const originalText = addToCartBtn.textContent;
  addToCartBtn.innerHTML = '<i class="fas fa-check"></i> Added!';
  addToCartBtn.style.background = '#4CAF50';
  
  setTimeout(() => {
    addToCartBtn.textContent = originalText;
    addToCartBtn.style.background = '';
  }, 2000);
});

// Initialize
window.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  loadProductFromUrl();
});
