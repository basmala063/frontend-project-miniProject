const CATEGORIES = [
    { name: "All", icon: "🍽️" },
    { name: "Pizza", icon: "🍕" },
    { name: "Burger", icon: "🍔" },
    { name: "Pasta", icon: "🍝" },
    { name: "Healthy", icon: "🥗" },
    { name: "Chicken", icon: "🍗" },
    { name: "Egyptian", icon: "🥘" },
    { name: "Desserts", icon: "🍰" }
];

const RESTAURANTS = [
    {
        id: 1, name: "Burger King", category: "Burger", cuisine: "American Burgers",
        image: "images/burger-king.jpeg",
        rating: 4.5, deliveryTime: "30-40 min", deliveryFee: 25, minOrder: 100,
        description: "Flame-grilled burgers, crispy fries and thick shakes made fresh to order.",
        dishes: ["whopper", "cheeseburger", "fries", "milkshake"]
    },
    {
        id: 2, name: "Pizza Hut", category: "Pizza", cuisine: "Italian Pizza",
        image: "images/pizza-hut.jpeg",
        rating: 4.3, deliveryTime: "30-40 min", deliveryFee: 0, minOrder: 120,
        description: "Hand-tossed pizzas with generous toppings, baked hot and delivered fast.",
        dishes: ["margherita", "pepperoni", "garlic bread", "supreme"]
    },
    {
        id: 3, name: "Koshary El Tahrir", category: "Egyptian", cuisine: "Egyptian Koshary",
        image: "images/koshari.jpeg",
        rating: 4.7, deliveryTime: "20-30 min", deliveryFee: 15, minOrder: 50,
        description: "The classic Egyptian bowl of rice, lentils, pasta and crispy onions with spicy tomato sauce.",
        dishes: ["koshary", "rice pudding", "hawawshi", "tamia"]
    },
    {
        id: 4, name: "Healthy Bites", category: "Healthy", cuisine: "Salads & Bowls",
        image: "images/healthy-bites.jpeg",
        rating: 4.4, deliveryTime: "25-35 min", deliveryFee: 20, minOrder: 90,
        description: "Fresh salads, protein bowls and smoothies made with light, clean ingredients.",
        dishes: ["caesar salad", "quinoa bowl", "smoothie", "avocado toast"]
    },
    {
        id: 5, name: "Pasta Express", category: "Pasta", cuisine: "Italian Pasta",
        image: "images/pasta-express.jpeg",
        rating: 4.2, deliveryTime: "30-45 min", deliveryFee: 22, minOrder: 80,
        description: "Creamy alfredo, rich bolognese and baked pasta cooked the Italian way.",
        dishes: ["alfredo", "bolognese", "penne arrabbiata", "lasagna"]
    },
    {
        id: 6, name: "Napoli Pizzeria", category: "Pizza", cuisine: "Wood-fired Pizza",
        image: "images/napoli-pizza.jpeg",
        rating: 4.6, deliveryTime: "35-45 min", deliveryFee: 30, minOrder: 150,
        description: "Thin-crust Neapolitan pizza baked in a wood-fired oven.",
        dishes: ["margherita", "four cheese", "calzone", "tiramisu"]
    },
    {
        id: 7, name: "Grill House", category: "Burger", cuisine: "Gourmet Burgers",
        image: "images/grill-house.jpeg",
        rating: 4.1, deliveryTime: "35-45 min", deliveryFee: 28, minOrder: 110,
        description: "Thick beef patties, smoked cheese and homemade sauces on toasted brioche buns.",
        dishes: ["smoky burger", "bbq burger", "onion rings", "fries"]
    },
    {
        id: 8, name: "Crispy Chicken Co.", category: "Chicken", cuisine: "Fried Chicken",
        image: "images/crispy-chicken.jpeg",
        rating: 4.0, deliveryTime: "25-35 min", deliveryFee: 18, minOrder: 70,
        description: "Extra crispy fried chicken, spicy wings and juicy chicken sandwiches.",
        dishes: ["fried chicken", "wings", "chicken sandwich", "coleslaw"]
    },
    {
        id: 9, name: "Green Bowl", category: "Healthy", cuisine: "Vegan & Healthy",
        image: "images/green-bowl.jpeg",
        rating: 4.5, deliveryTime: "20-30 min", deliveryFee: 0, minOrder: 85,
        description: "Plant-based meals, fresh juices and balanced bowls for a lighter day.",
        dishes: ["vegan bowl", "falafel wrap", "green juice", "hummus"]
    },
    {
        id: 10, name: "Mama's Kitchen", category: "Pasta", cuisine: "Homemade Pasta",
        image: "images/mama's-kitchen.jpeg",
        rating: 4.6, deliveryTime: "35-50 min", deliveryFee: 25, minOrder: 100,
        description: "Slow-cooked sauces and handmade pasta, just like at home.",
        dishes: ["spaghetti", "ravioli", "mac and cheese", "garlic bread"]
    },
    {
        id: 11, name: "Sweet Tooth", category: "Desserts", cuisine: "Cakes & Waffles",
        image: "images/sweet.jpeg",
        rating: 4.8, deliveryTime: "20-30 min", deliveryFee: 15, minOrder: 60,
        description: "Warm waffles, fluffy pancakes, donuts and cakes for every sweet craving.",
        dishes: ["waffle", "pancakes", "donuts", "cheesecake", "ice cream"]
    },
    {
        id: 12, name: "El Shabrawy Grill", category: "Egyptian", cuisine: "Egyptian Grills",
        image: "images/shabrawy.jpeg",
        rating: 4.4, deliveryTime: "40-50 min", deliveryFee: 30, minOrder: 140,
        description: "Charcoal-grilled kebab, kofta and tarb with fresh bread and tahini.",
        dishes: ["kebab", "kofta", "grilled chicken", "baba ghanoush"]
    }
];

(function () {
    "use strict";

    const LOCATION_KEY = "foodapp_location";
    const DEFAULT_LOCATION = "Cairo, Minya";
    const $ = function (id) { return document.getElementById(id); };

    const FALLBACK_IMG =
        "data:image/svg+xml;utf8," +
        encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" width="700" height="525">' +
            '<rect width="100%" height="100%" fill="#1f2245"/>' +
            '<text x="50%" y="50%" font-size="72" text-anchor="middle" dominant-baseline="middle">🍽️</text></svg>'
        );

    /* ---------- Shared helpers (exposed as window.FoodApp) ---------- */
    function updateCartBadge() {
        const badge = $("cartCount");
        if (!badge) return;
        let total = 0;
        try {
            const cart = JSON.parse(localStorage.getItem("cart"));
            if (Array.isArray(cart)) {
                total = cart.reduce(function (sum, item) { return sum + (Number(item.qty) || 0); }, 0);
            }
        } catch (e) { total = 0; }
        badge.textContent = total;
        badge.classList.toggle("d-none", total === 0);
    }

    function getLocation() {
        try { return localStorage.getItem(LOCATION_KEY) || DEFAULT_LOCATION; }
        catch (e) { return DEFAULT_LOCATION; }
    }

    function showLocation() {
        document.querySelectorAll(".nav-location-text").forEach(function (el) { el.textContent = getLocation(); });
    }

    function setLocation(value) {
        const clean = (value || "").trim() || DEFAULT_LOCATION;
        try { localStorage.setItem(LOCATION_KEY, clean); } catch (e) { /* ignore */ }
        showLocation();
        return clean;
    }

    const searchInputs = Array.from(document.querySelectorAll(".nav-search-input"));

    function setSearchValue(value) {
        searchInputs.forEach(function (input) { input.value = value; });
    }

    function createRestaurantCard(r) {
        const fee = r.deliveryFee === 0
            ? '<span class="fee-tag free">Free delivery</span>'
            : '<span class="fee-tag">' + r.deliveryFee + ' EGP delivery</span>';
        return (
            '<div class="col-12 col-sm-6 col-lg-4 col-xl-3">' +
            '<a class="restaurant-card" href="restaurant-details.html?id=' + r.id + '">' +
            '<div class="restaurant-img">' +
            '<img src="' + r.image + '" alt="' + r.name + '" loading="lazy" ' +
            'onerror="this.onerror=null;this.src=FoodApp.FALLBACK_IMG">' +
            '</div>' +
            '<div class="restaurant-body">' +
            '<h3 class="restaurant-name">' + r.name + '</h3>' +
            '<p class="restaurant-cuisine">' + r.cuisine + '</p>' +
            '<div class="restaurant-meta">' +
            '<span class="meta-rating"><i class="bi bi-star-fill"></i> ' + r.rating.toFixed(1) + '</span>' +
            '<span class="meta-time"><i class="bi bi-clock"></i> ' + r.deliveryTime + '</span>' +
            '</div>' + fee + '</div></a></div>'
        );
    }

    const FoodApp = window.FoodApp = {
        FALLBACK_IMG: FALLBACK_IMG,
        createRestaurantCard: createRestaurantCard,
        updateCartBadge: updateCartBadge,
        getLocation: getLocation,
        setLocation: setLocation,
        setSearchValue: setSearchValue,
        onSearch: null
    };

    /* ---------- Navbar: active link, cart badge, location, search ---------- */
    let page = location.pathname.split("/").pop() || "index.html";
    if (page === "restaurant-details.html") page = "restaurants.html";
    document.querySelectorAll(".app-navbar [data-page]").forEach(function (link) {
        const isActive = link.dataset.page === page;
        link.classList.toggle("active", isActive);
        if (isActive) link.setAttribute("aria-current", "page");
    });

    updateCartBadge();
    showLocation();
    window.addEventListener("storage", updateCartBadge);

    searchInputs.forEach(function (input) {
        input.addEventListener("input", function () {
            setSearchValue(input.value);
            if (typeof FoodApp.onSearch === "function") FoodApp.onSearch(input.value);
        });
    });

    document.querySelectorAll(".nav-search").forEach(function (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            const query = form.querySelector(".nav-search-input").value.trim();
            if (typeof FoodApp.onSearch === "function") {
                FoodApp.onSearch(query);
                const menu = $("mainNav");
                const instance = menu && window.bootstrap && bootstrap.Offcanvas.getInstance(menu);
                if (instance) instance.hide();
            } else {
                location.href = query ? "restaurants.html?search=" + encodeURIComponent(query) : "restaurants.html";
            }
        });
    });

    /* ---------- Home page ---------- */
    const categoryList = $("categoryList");
    if (categoryList) {
        categoryList.innerHTML = CATEGORIES.map(function (c) {
            const href = c.name === "All" ? "restaurants.html" : "restaurants.html?category=" + encodeURIComponent(c.name);
            return (
                '<a class="category-item" href="' + href + '">' +
                '<span class="category-icon" aria-hidden="true">' + c.icon + "</span>" +
                '<span class="category-name">' + c.name + "</span></a>"
            );
        }).join("");

        $("popularList").innerHTML = RESTAURANTS.slice()
            .sort(function (a, b) { return b.rating - a.rating; })
            .slice(0, 4)
            .map(createRestaurantCard).join("");

        const locationInput = $("locationInput");
        locationInput.value = getLocation();
        $("locationForm").addEventListener("submit", function (e) {
            e.preventDefault();
            setLocation(locationInput.value);
            location.href = "restaurants.html";
        });
    }

    /* ---------- Restaurants page ---------- */
    const listBox = $("restaurantsList");
    if (listBox) {
        const filtersBox = $("categoryFilters");
        const resetBtn = $("resetBtn");
        const resultsInfo = $("resultsInfo");
        const emptyState = $("emptyState");
        const emptyQuery = $("emptyQuery");

        const params = new URLSearchParams(location.search);
        const validCategories = CATEGORIES.map(function (c) { return c.name; });
        const state = {
            category: validCategories.includes(params.get("category")) ? params.get("category") : "All",
            search: (params.get("search") || "").trim()
        };

        function matches(r) {
            const categoryOk = state.category === "All" || r.category === state.category;
            if (!state.search) return categoryOk;
            const text = [r.name, r.cuisine, r.category].concat(r.dishes).join(" ").toLowerCase();
            return categoryOk && text.includes(state.search.toLowerCase());
        }

        function render() {
            const results = RESTAURANTS.filter(matches);
            const hasFilter = state.category !== "All" || state.search !== "";

            filtersBox.innerHTML = CATEGORIES.map(function (c) {
                const active = c.name === state.category;
                return (
                    '<button type="button" class="filter-chip' + (active ? " active" : "") + '" ' +
                    'data-category="' + c.name + '" aria-pressed="' + active + '">' + c.icon + " " + c.name + "</button>"
                );
            }).join("");
            resetBtn.classList.toggle("d-none", !hasFilter);

            if (results.length === 0) {
                listBox.innerHTML = "";
                emptyState.classList.remove("d-none");
                emptyQuery.textContent = state.search
                    ? "for “" + state.search + "”" + (state.category !== "All" ? " in " + state.category : "")
                    : "in " + state.category;
                resultsInfo.textContent = "0 restaurants found";
            } else {
                emptyState.classList.add("d-none");
                listBox.innerHTML = results.map(createRestaurantCard).join("");
                resultsInfo.textContent = results.length + (results.length === 1 ? " restaurant" : " restaurants") + " found";
            }

            const p = new URLSearchParams();
            if (state.category !== "All") p.set("category", state.category);
            if (state.search) p.set("search", state.search);
            const qs = p.toString();
            history.replaceState(null, "", location.pathname + (qs ? "?" + qs : ""));
        }

        function resetAll() {
            state.category = "All";
            state.search = "";
            setSearchValue("");
            render();
        }

        filtersBox.addEventListener("click", function (e) {
            const btn = e.target.closest("[data-category]");
            if (!btn) return;
            state.category = btn.dataset.category;
            render();
        });
        FoodApp.onSearch = function (query) { state.search = query.trim(); render(); };
        resetBtn.addEventListener("click", resetAll);
        $("emptyResetBtn").addEventListener("click", resetAll);

        setSearchValue(state.search);
        render();
    }
})();