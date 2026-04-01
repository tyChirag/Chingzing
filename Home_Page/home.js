const API_KEY = '3d30233c2fb74036bd34ab8ba588a5ca';
const API_BASE = 'https://api.spoonacular.com/recipes';

const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const restaurantsGrid = document.getElementById('restaurants-grid');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const cuisineFilter = document.getElementById('cuisine-filter');
const ratingFilter = document.getElementById('rating-filter');
const deliveryFilter = document.getElementById('delivery-filter');
const sortBtn = document.getElementById('sort-btn');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const suggestionsGrid = document.getElementById('suggestions-grid');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

let currentRecipes = [];
let sortOrder = 'default';
let suggestions = [];
let currentSuggestionIndex = 0;

// Fallback food images for better reliability
const fallbackFoodImages = [
  'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/3915857/pexels-photo-3915857.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/2641886/pexels-photo-2641886.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1373915/pexels-photo-1373915.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=400'
];

// Hamburger menu toggle
hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
  });
});

// Carousel navigation
prevBtn.addEventListener('click', () => {
  currentSuggestionIndex = Math.max(0, currentSuggestionIndex - 3);
  renderSuggestions();
});

nextBtn.addEventListener('click', () => {
  currentSuggestionIndex = Math.min(suggestions.length - 3, currentSuggestionIndex + 3);
  renderSuggestions();
});

// Search functionality
searchBtn.addEventListener('click', () => {
  const query = searchInput.value.trim();
  if (query) {
    searchRecipes(query);
  }
});

searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const query = searchInput.value.trim();
    if (query) {
      searchRecipes(query);
    }
  }
});

// Filter listeners
cuisineFilter.addEventListener('change', applyFilters);
ratingFilter.addEventListener('change', applyFilters);
deliveryFilter.addEventListener('change', applyFilters);

// Sort button
sortBtn.addEventListener('click', () => {
  sortOrder = sortOrder === 'default' ? 'rating' : 'default';
  applyFilters();
});

async function searchRecipes(query) {
  showLoading();
  clearError();

  try {
    const url = `${API_BASE}/complexSearch?query=${encodeURIComponent(query)}&number=12&apiKey=${API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      currentRecipes = data.results;
      applyFilters();
    } else {
      showError('No restaurants found. Try a different search term.');
      currentRecipes = [];
      renderRestaurants([]);
    }
  } catch (error) {
    console.error('Search Error:', error);
    showError(`Failed to search restaurants: ${error.message}`);
  } finally {
    hideLoading();
  }
}

function applyFilters() {
  let filtered = [...currentRecipes];

  // Apply cuisine filter
  const selectedCuisine = cuisineFilter.value;
  if (selectedCuisine) {
    filtered = filtered.filter(recipe => {
      const cuisines = recipe.cuisines || [];
      return cuisines.some(c => c.toLowerCase().includes(selectedCuisine.toLowerCase()));
    });
  }

  // Apply rating filter
  const selectedRating = parseFloat(ratingFilter.value);
  if (selectedRating) {
    filtered = filtered.filter(recipe => {
      const rating = recipe.spoonacularScore ? recipe.spoonacularScore / 20 : 0;
      return rating >= selectedRating;
    });
  }

  // Apply delivery time filter
  const selectedDelivery = parseInt(deliveryFilter.value);
  if (selectedDelivery) {
    filtered = filtered.filter(recipe => {
      const deliveryTime = recipe.readyInMinutes || 30;
      return deliveryTime <= selectedDelivery;
    });
  }

  // Apply sort
  if (sortOrder === 'rating') {
    filtered.sort((a, b) => {
      const ratingA = a.spoonacularScore ? a.spoonacularScore / 20 : 0;
      const ratingB = b.spoonacularScore ? b.spoonacularScore / 20 : 0;
      return ratingB - ratingA;
    });
  }

  renderRestaurants(filtered);
}

function renderRestaurants(restaurants) {
  restaurantsGrid.innerHTML = '';

  if (restaurants.length === 0) {
    restaurantsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #999;">No restaurants found. Try adjusting your filters!</p>';
    return;
  }

  restaurants.forEach(recipe => {
    const card = document.createElement('div');
    card.className = 'restaurant-card';

    const rating = recipe.spoonacularScore ? (recipe.spoonacularScore / 20).toFixed(1) : 'N/A';
    const cuisines = (recipe.cuisines && recipe.cuisines.length > 0) ? recipe.cuisines.join(', ') : 'Multi-Cuisine';
    const deliveryTime = recipe.readyInMinutes || 30;
    const deliveryCost = Math.floor(Math.random() * 40) + 20;
    const minOrder = (Math.floor(Math.random() * 5) + 2) * 100;

    card.innerHTML = `
      <div style="position: relative;">
        <img src="${recipe.image || 'https://via.placeholder.com/280x160?text=Restaurant'}" alt="${recipe.title}" class="restaurant-image">
        <div class="restaurant-badge">Pro Seller</div>
      </div>
      <div class="restaurant-info">
        <div class="restaurant-header">
          <h3 class="restaurant-name">${recipe.title}</h3>
          <p class="restaurant-cuisines">${cuisines}</p>
        </div>
        
        <div class="restaurant-rating">
          <span class="stars">${rating !== 'N/A' ? '⭐' : 'N/A'}</span>
          <span>${rating}/5 (${Math.floor(Math.random() * 500) + 100} ratings)</span>
        </div>

        <div class="restaurant-meta">
          <span><i class="fas fa-clock"></i> ${deliveryTime} mins</span>
          <span><i class="fas fa-rupee-sign"></i> ${deliveryCost} delivery</span>
          <span><i class="fas fa-tag"></i> Min ₹${minOrder}</span>
        </div>

        <button class="restaurant-btn" data-id="${recipe.id}">Order Now</button>
      </div>
    `;

    card.querySelector('.restaurant-btn').addEventListener('click', () => {
      orderNow(recipe.id, recipe.title);
    });

    restaurantsGrid.appendChild(card);
  });
}

function orderNow(id, title) {
  alert(`Added "${title}" to cart!\n\nIn a full app, this would take you to the restaurant menu and checkout page.`);
}

function showLoading() {
  loadingDiv.style.display = 'block';
  restaurantsGrid.innerHTML = '';
}

function hideLoading() {
  loadingDiv.style.display = 'none';
}

function showError(message) {
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
}

function clearError() {
  errorDiv.textContent = '';
  errorDiv.style.display = 'none';
}

// Food Suggestions Functions
async function loadSuggestions() {
  try {
    const foodItems = ['pizza', 'burger', 'pasta', 'biryani', 'sandwich', 'noodles', 'dosa', 'samosa', 'tacos', 'salad', 'soup', 'sushi'];
    const randomFood = foodItems[Math.floor(Math.random() * foodItems.length)];
    
    const url = `${API_BASE}/complexSearch?query=${randomFood}&number=12&apiKey=${API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to load suggestions');
    }

    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      suggestions = data.results;
      currentSuggestionIndex = 0;
      renderSuggestions();
      
      // Refresh suggestions every 30 seconds
      setInterval(() => {
        loadSuggestions();
      }, 30000);
    }
  } catch (error) {
    console.error('Suggestions Error:', error);
  }
}

function renderSuggestions() {
  suggestionsGrid.innerHTML = '';

  if (suggestions.length === 0) {
    return;
  }

  // Show 3 items at a time
  const itemsToShow = suggestions.slice(currentSuggestionIndex, currentSuggestionIndex + 3);

  itemsToShow.forEach((recipe, index) => {
    const card = document.createElement('div');
    card.className = 'suggestion-card';

    const price = Math.floor(Math.random() * 400) + 150;
    const deliveryTime = recipe.readyInMinutes || Math.floor(Math.random() * 30) + 15;
    const discount = [10, 15, 20, 25, 30][Math.floor(Math.random() * 5)];
    
    // Use recipe image if available, otherwise use fallback images
    let imageUrl = recipe.image;
    if (!imageUrl || imageUrl.includes('via.placeholder')) {
      imageUrl = fallbackFoodImages[Math.floor(Math.random() * fallbackFoodImages.length)];
    }

    card.innerHTML = `
      <img src="${imageUrl}" alt="${recipe.title}" class="suggestion-image" onerror="this.src='https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=400'">
      <div class="suggestion-info">
        <h3 class="suggestion-name">${recipe.title}</h3>
        <p class="suggestion-desc">${recipe.cuisines && recipe.cuisines.length > 0 ? recipe.cuisines[0] + ' cuisine' : 'Delicious dish'}</p>
        
        <div class="suggestion-meta">
          <span><i class="fas fa-star" style="color: #ffc107;"></i> ${(Math.random() * 2 + 3.5).toFixed(1)}</span>
          <span><i class="fas fa-clock"></i> ${deliveryTime}m</span>
          <span style="color: var(--primary-color); font-weight: 600;">-${discount}%</span>
        </div>

        <div class="suggestion-price">₹${price}</div>
        <button class="suggestion-add-btn" data-id="${recipe.id}">Add to Cart</button>
      </div>
    `;

    card.querySelector('.suggestion-add-btn').addEventListener('click', () => {
      addToCart(recipe.id, recipe.title, price);
    });

    suggestionsGrid.appendChild(card);
  });

  // Update button states
  prevBtn.disabled = currentSuggestionIndex === 0;
  nextBtn.disabled = currentSuggestionIndex + 3 >= suggestions.length;
}

function addToCart(id, title, price) {
  alert(`Added "${title}" (₹${price}) to cart!`);
}

// Load popular restaurants on page load
window.addEventListener('load', () => {
  searchRecipes('popular restaurants');
  loadSuggestions();
});
