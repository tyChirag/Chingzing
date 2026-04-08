const foodItems = [
	{ id: 1, name: 'Paneer Tikka Masala', cuisine: 'Indian', rating: 4.8, price: 12.99 },
	{ id: 2, name: 'Veggie Burger', cuisine: 'American', rating: 4.3, price: 9.5 },
	{ id: 3, name: 'Sushi Platter', cuisine: 'Japanese', rating: 4.9, price: 19.99 },
	{ id: 4, name: 'Margherita Pizza', cuisine: 'Italian', rating: 4.5, price: 11.5 },
	{ id: 5, name: 'Falafel Wrap', cuisine: 'Mediterranean', rating: 4.4, price: 8.75 },
	{ id: 6, name: 'Chocolate Waffles', cuisine: 'Dessert', rating: 4.7, price: 7.25 },
	{ id: 7, name: 'Caesar Salad', cuisine: 'Healthy', rating: 4.2, price: 8.99 },
	{ id: 8, name: 'Spicy Ramen', cuisine: 'Asian', rating: 4.6, price: 13.5 }
];

const searchInput = document.getElementById('food-search');
const sortSelect = document.getElementById('food-sort');
const filterSelect = document.getElementById('food-filter');
const foodGrid = document.getElementById('food-grid');

function createCard(item) {
	const card = document.createElement('article');
	card.className = 'food-card';

	const title = document.createElement('h2');
	title.textContent = item.name;

	const description = document.createElement('p');
	description.textContent = `${item.cuisine} • Delicious restaurant-style dish`;

	const meta = document.createElement('div');
	meta.className = 'food-meta';

	const rating = document.createElement('span');
	rating.className = 'food-pill';
	rating.textContent = `⭐ ${item.rating.toFixed(1)}`;

	const price = document.createElement('span');
	price.className = 'food-pill';
	price.textContent = `$${item.price.toFixed(2)}`;

	const cuisine = document.createElement('span');
	cuisine.className = 'food-pill';
	cuisine.textContent = item.cuisine;

	meta.append(rating, price, cuisine);
	card.append(title, description, meta);
	return card;
}

function renderItems(items) {
	foodGrid.innerHTML = '';

	if (items.length === 0) {
		const empty = document.createElement('div');
		empty.className = 'food-empty';
		empty.textContent = 'No dishes match that search. Try another keyword or reset sorting.';
		foodGrid.appendChild(empty);
		return;
	}

	const fragment = document.createDocumentFragment();
	items.forEach(item => fragment.appendChild(createCard(item)));
	foodGrid.appendChild(fragment);
}

function filterAndSort() {
	const query = searchInput.value.trim().toLowerCase();
	const selectedCuisine = filterSelect.value;
	let filtered = foodItems.filter(item => {
		return (
			item.name.toLowerCase().includes(query) ||
			item.cuisine.toLowerCase().includes(query)
		);
	});

	if (selectedCuisine !== 'all') {
		filtered = filtered.filter(item => item.cuisine === selectedCuisine);
	}

	const sortValue = sortSelect.value;
	filtered.sort((a, b) => {
		switch (sortValue) {
			case 'name-asc':
				return a.name.localeCompare(b.name);
			case 'name-desc':
				return b.name.localeCompare(a.name);
			case 'rating-desc':
				return b.rating - a.rating;
			case 'rating-asc':
				return a.rating - b.rating;
			case 'price-asc':
				return a.price - b.price;
			case 'price-desc':
				return b.price - a.price;
			default:
				return a.id - b.id;
		}
	});

	renderItems(filtered);
}

searchInput.addEventListener('input', filterAndSort);
sortSelect.addEventListener('change', filterAndSort);
filterSelect.addEventListener('change', filterAndSort);

window.addEventListener('DOMContentLoaded', () => {
	populateCuisineFilter();
	renderItems(foodItems);
});

function populateCuisineFilter() {
	const cuisines = Array.from(new Set(foodItems.map(item => item.cuisine))).sort();
	cuisines.forEach(cuisine => {
		const option = document.createElement('option');
		option.value = cuisine;
		option.textContent = cuisine;
		filterSelect.appendChild(option);
	});
}
