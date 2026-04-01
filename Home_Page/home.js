const API_KEY = '8aea90b3d3b04c8a897ce23df1055e97'; // Spoonacular API key
const API_BASE = 'https://api.spoonacular.com/recipes';

const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const recipesGrid = document.getElementById('recipes-grid');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const dietFilters = document.querySelectorAll('.diet-filter');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

let currentRecipes = [];

// Hamburger menu toggle
hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('active');
});

// Close menu when link is clicked
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
  });
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

// Diet filter functionality
dietFilters.forEach(filter => {
  filter.addEventListener('change', applyFilters);
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
      showError('No recipes found. Try a different search term.');
      currentRecipes = [];
      renderRecipes([]);
    }
  } catch (error) {
    console.error('Search Error:', error);
    showError(`Failed to search recipes: ${error.message}`);
  } finally {
    hideLoading();
  }
}

async function getRecipeDetails(id) {
  try {
    const url = `${API_BASE}/${id}/information?apiKey=${API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Details Error:', error);
    return null;
  }
}

function applyFilters() {
  const selectedDiets = Array.from(dietFilters)
    .filter(filter => filter.checked)
    .map(filter => filter.value.toLowerCase());

  let filtered = currentRecipes;

  if (selectedDiets.length > 0) {
    filtered = currentRecipes.filter(recipe => {
      const recipeDiets = (recipe.diets || []).map(d => d.toLowerCase());
      return selectedDiets.some(diet => recipeDiets.includes(diet));
    });
  }

  renderRecipes(filtered);
}

function renderRecipes(recipes) {
  recipesGrid.innerHTML = '';

  if (recipes.length === 0) {
    recipesGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #999;">No recipes found. Try searching for something!</p>';
    return;
  }

  recipes.forEach(recipe => {
    const card = document.createElement('div');
    card.className = 'recipe-card';

    const rating = recipe.spoonacularScore ? (recipe.spoonacularScore / 20).toFixed(1) : 'N/A';
    const diets = recipe.diets && recipe.diets.length > 0 ? recipe.diets.join(', ') : 'Mixed';

    card.innerHTML = `
      <img src="${recipe.image || 'https://via.placeholder.com/280x200?text=Recipe'}" alt="${recipe.title}" class="recipe-image">
      <div class="recipe-info">
        <h3 class="recipe-title">${recipe.title}</h3>
        <div class="recipe-meta">
          <span><i class="fas fa-clock"></i> ${recipe.readyInMinutes || 'N/A'} mins</span>
          <span><i class="fas fa-users"></i> ${recipe.servings || 'N/A'} servings</span>
        </div>
        <div class="recipe-meta">
          <span><i class="fas fa-leaf"></i> ${diets}</span>
        </div>
        ${rating !== 'N/A' ? `
          <div class="recipe-rating">
            <span class="stars">${'⭐'.repeat(Math.round(rating / 2))}</span>
            <span>${rating}/5</span>
          </div>
        ` : ''}
        <button class="recipe-btn" data-id="${recipe.id}">View Recipe</button>
      </div>
    `;

    card.querySelector('.recipe-btn').addEventListener('click', () => {
      viewRecipe(recipe.id, recipe.title);
    });

    recipesGrid.appendChild(card);
  });
}

function viewRecipe(id, title) {
  alert(`Recipe: ${title}\n\nRecipe ID: ${id}\n\nIn a full app, this would open a detailed recipe page with ingredients and instructions.\n\nVisit: https://spoonacular.com/recipes/${title.replace(/\\s+/g, '-')}-${id}`);
}

function showLoading() {
  loadingDiv.style.display = 'block';
  recipesGrid.innerHTML = '';
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

// Load popular recipes on page load
window.addEventListener('load', () => {
  searchRecipes('popular');
});
