const CART_KEY = 'chingzing_cart';
const cartItemsContainer = document.getElementById('cart-items-container');
const summarySubtotal = document.getElementById('summary-subtotal');
const summaryDelivery = document.getElementById('summary-delivery');
const summaryTaxes = document.getElementById('summary-taxes');
const summaryTotal = document.getElementById('summary-total');
const itemsCountText = document.getElementById('items-count-text');
const cartCount = document.getElementById('cart-count');
const checkoutBtn = document.getElementById('checkout-btn');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Hamburger menu toggle
if (hamburger) {
  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });
}

function getCart() {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function updateCartCount(cart) {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCount) {
    cartCount.textContent = totalItems;
  }
}

function renderCart() {
  const cart = getCart();
  updateCartCount(cart);
  
  cartItemsContainer.innerHTML = '';
  
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="empty-cart-msg">
        <i class="fas fa-shopping-basket"></i>
        <h3>Your cart is empty</h3>
        <p>Looks like you haven't added anything to your cart yet.</p>
        <a href="../Home_Page/home.html" class="shop-btn">Browse Restaurants</a>
      </div>
    `;
    itemsCountText.textContent = '0 items';
    checkoutBtn.disabled = true;
    updateSummary([]);
    return;
  }

  checkoutBtn.disabled = false;
  itemsCountText.textContent = `${cart.reduce((sum, item) => sum + item.quantity, 0)} items`;

  cart.forEach(item => {
    const itemEl = document.createElement('div');
    itemEl.className = 'cart-item';
    itemEl.innerHTML = `
      <img src="${item.image || 'https://via.placeholder.com/100?text=Food'}" alt="${item.title}" class="item-img">
      <div class="item-details">
        <h3 class="item-title">${item.title}</h3>
        <p class="item-price">₹${item.price}</p>
        <div class="item-controls">
          <div class="quantity-controller">
            <button class="quantity-btn minus-btn" data-id="${item.id}">-</button>
            <span class="quantity-display">${item.quantity}</span>
            <button class="quantity-btn plus-btn" data-id="${item.id}">+</button>
          </div>
          <button class="remove-btn" data-id="${item.id}">
            <i class="fas fa-trash-alt"></i> Remove
          </button>
        </div>
      </div>
    `;
    cartItemsContainer.appendChild(itemEl);
  });

  // Attach event listeners for buttons
  document.querySelectorAll('.minus-btn').forEach(btn => {
    btn.addEventListener('click', (e) => updateQuantity(e.target.dataset.id, -1));
  });
  
  document.querySelectorAll('.plus-btn').forEach(btn => {
    btn.addEventListener('click', (e) => updateQuantity(e.target.dataset.id, 1));
  });
  
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => removeItem(e.currentTarget.dataset.id));
  });

  updateSummary(cart);
}

function updateQuantity(id, change) {
  let cart = getCart();
  const itemIndex = cart.findIndex(item => String(item.id) === String(id));
  
  if (itemIndex > -1) {
    cart[itemIndex].quantity += change;
    if (cart[itemIndex].quantity <= 0) {
      cart.splice(itemIndex, 1);
    }
    saveCart(cart);
    renderCart();
  }
}

function removeItem(id) {
  let cart = getCart();
  cart = cart.filter(item => String(item.id) !== String(id));
  saveCart(cart);
  renderCart();
}

function updateSummary(cart) {
  if (cart.length === 0) {
    summarySubtotal.textContent = '₹0';
    summaryDelivery.textContent = '₹0';
    summaryTaxes.textContent = '₹0';
    summaryTotal.textContent = '₹0';
    return;
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const delivery = 40; // Flat delivery fee for prototype
  const taxes = Math.round(subtotal * 0.05); // 5% tax
  const total = subtotal + delivery + taxes;

  summarySubtotal.textContent = `₹${subtotal}`;
  summaryDelivery.textContent = `₹${delivery}`;
  summaryTaxes.textContent = `₹${taxes}`;
  summaryTotal.textContent = `₹${total}`;
}

checkoutBtn.addEventListener('click', () => {
  const cart = getCart();
  if (cart.length === 0) return;
  
  alert('Order placed successfully! Thank you for ordering with Chingzing.');
  localStorage.removeItem(CART_KEY);
  renderCart();
});

// Initialize
window.addEventListener('DOMContentLoaded', () => {
  renderCart();
});
