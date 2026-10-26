# FoodApp — Integrated Student Project

This folder combines the Home, Restaurants, Restaurant Menu, Cart & Checkout, My Orders, and Profile/Login pages with one shared design system.

## Folder structure

- `index.html` — Home page
- `restaurants.html` — Restaurant search and category filters
- `restaurant-details.html?id=burger-house` — Restaurant menu and Add to Cart
- `cart.html` — Cart, promo code, checkout, and success screen
- `orders.html` — Order history, details modal, and cancellation
- `profile.html` — Sign up, login, and profile editing
- `css/style.css` — Shared red/cream FoodApp theme
- `js/app.js` — Shared navigation, data, storage helpers, and restaurant/menu rendering
- `js/cart.js` — Cart and checkout
- `js/orders.js` — Orders history
- `js/profile.js` — Account/profile prototype

## Local storage contract

- `cart`: items with `id`, `name`, `price`, `quantity`, `restaurantId`, and `restaurantName`
- `orders`: orders created by checkout, newest first
- `currentUser`: current profile `{name,email,phone,address}`
- `appliedPromo`: `WELCOME10` or `FOOD20`
- `foodAppAccount`: demo-only signup credentials

## Important notes

- This is a front-end student prototype. Login credentials stored in localStorage are not secure and must not be used for real accounts or passwords.
- Run with VS Code Live Server or another local HTTP server for best results.
- Restaurant data and menu items are sample data in `js/app.js`. Replace them with the team's actual data/images as needed.
- All pages use the shared FoodApp navbar, Poppins font, and the same red/cream theme.
