# 🍔 CHINGZING - Food Delivery Web App

A dynamic food delivery web application built with JavaScript, powered by a public meals API. Browse meals, search by name, filter by category, and sort results — all in a clean, responsive UI.

---

## 📌 Purpose

FoodDash simulates a food delivery experience where users can explore a variety of meals, search for specific dishes, filter by cuisine or category, and sort results by name or other criteria. The goal is to demonstrate proficiency in JavaScript, public API integration, and interactive UI development.

---

## 🔗 API 

**Spoonacular Food API** — [https://spoonacular.com/food-api](https://spoonacular.com/food-api)

- Provides recipes with images, names, ratings, ingredients, instructions, and nutrition
- Free tier: 150 requests/day; paid plans available
- Endpoints used:
  - Complex search: [https://api.spoonacular.com/recipes/complexSearch](https://api.spoonacular.com/recipes/complexSearch)
  - Get recipe information 

**TheMealDB** — [https://www.themealdb.com/api.php](https://www.themealdb.com/api.php)

- Free, no API key required
- Provides meal names, categories, cuisines, images, and ingredients
- Endpoints used:
  - Search meals by name
  - Filter meals by category
  - List all meal categories

---

## ✨ Features

- **API Integration** — Fetch and dynamically display meal data using the `fetch` API
- **Search** — Search meals by name using `.filter()` on fetched results
- **Filter** — Filter meals by category (e.g., Chicken, Seafood, Dessert) using `.filter()`
- **Sort** — Sort meals alphabetically (A–Z / Z–A) using `.sort()`
- **Favorites** — Like/save meals using `.map()` and Local Storage
- **Dark / Light Mode** — Theme toggle with preference saved in Local Storage
- **Loading Indicators** — Spinner shown during API fetch calls
- **Responsive Design** — Mobile, tablet, and desktop layouts using CSS

### ⭐ Bonus Features (Optional)
- **Debouncing** on the search input to limit API calls
- **Pagination** to handle large sets of meal results
- **Local Storage** for persisting favorites and theme preference

---

## 🛠️ Technologies

| Technology | Usage |
|---|---|
| HTML | Page structure and semantics |
| CSS | Styling, layout, responsiveness |
| JavaScript (ES6+) | Logic, API calls, DOM manipulation |
| TheMealDB API | Meal data source |
| Local Storage | Persisting user preferences |

> 💡 May optionally use Tailwind CSS for utility-based styling.


---

## 🚀 Setup & Running the Project

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/fooddash.git
   ```

2. **Navigate into the project folder**
   ```bash
   cd fooddash
   ```

3. **Open in browser**

   Simply open `index.html` in any modern browser — no build tools or dependencies required.

   Or use the Live Server extension in VS Code for a better development experience.

---

## 👤 Author

**Chirag Tyagi**
GitHub: [@tyChirag](https://github.com/tyChirag)
