const FoodApp = (() => {
  const CART_KEY = "cart";
  const ORDERS_KEY = "orders";
  const USER_KEY = "currentUser";
  const PROMO_KEY = "appliedPromo";
  const DELIVERY_FEE = 15;
  const PROMOS = { WELCOME10: 10, FOOD20: 20 };

  const CATEGORIES = [
    { name: "Burgers", emoji: "🍔" },
    { name: "Pizza", emoji: "🍕" },
    { name: "Asian", emoji: "🍜" },
    { name: "Healthy", emoji: "🥗" },
    { name: "Desserts", emoji: "🍰" },
    { name: "Drinks", emoji: "🥤" }
  ];

  const RESTAURANTS = [
    {
      id: "burger-house",
      name: "Burger House",
      category: "Burgers",
      rating: 4.8,
      delivery: "20–30 min",
      fee: 15,
      description: "Juicy burgers, crispy fries and classic comfort food.",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80",
      menu: [
        { id: "bh-classic", name: "Classic Beef Burger", price: 145, emoji: "🍔", description: "Beef patty, lettuce, tomato and house sauce." },
        { id: "bh-cheese", name: "Double Cheese Burger", price: 185, emoji: "🍔", description: "Double beef, cheddar and pickles." },
        { id: "bh-fries", name: "Crispy Fries", price: 55, emoji: "🍟", description: "Golden fries with a pinch of salt." }
      ]
    },
    {
      id: "mamas-kitchen",
      name: "Mama's Kitchen",
      category: "Healthy",
      rating: 4.7,
      delivery: "25–35 min",
      fee: 15,
      description: "Fresh home-style meals made with love.",
      image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80",
      menu: [
        { id: "mk-chicken", name: "Grilled Chicken Bowl", price: 135, emoji: "🍗", description: "Grilled chicken, rice and seasonal vegetables." },
        { id: "mk-salad", name: "Fresh Garden Salad", price: 75, emoji: "🥗", description: "Crisp greens, tomatoes and house dressing." },
        { id: "mk-pasta", name: "Creamy Pasta", price: 120, emoji: "🍝", description: "Creamy sauce with herbs and parmesan." }
      ]
    },
    {
      id: "pizza-corner",
      name: "Pizza Corner",
      category: "Pizza",
      rating: 4.6,
      delivery: "30–40 min",
      fee: 20,
      description: "Oven-baked pizza with generous toppings.",
      image: "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=900&q=80",
      menu: [
        { id: "pc-margherita", name: "Margherita Pizza", price: 130, emoji: "🍕", description: "Tomato, mozzarella and fresh basil." },
        { id: "pc-pepperoni", name: "Pepperoni Pizza", price: 175, emoji: "🍕", description: "Pepperoni, mozzarella and tomato sauce." },
        { id: "pc-garlic", name: "Garlic Bread", price: 50, emoji: "🥖", description: "Warm bread with garlic butter." }
      ]
    },
    {
      id: "noodle-room",
      name: "Noodle Room",
      category: "Asian",
      rating: 4.5,
      delivery: "25–35 min",
      fee: 15,
      description: "Wok-tossed noodles and Asian-inspired favorites.",
      image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=80",
      menu: [
        { id: "nr-noodles", name: "Chicken Noodles", price: 125, emoji: "🍜", description: "Noodles with chicken and vegetables." },
        { id: "nr-dumplings", name: "Steamed Dumplings", price: 90, emoji: "🥟", description: "Six dumplings with dipping sauce." }
      ]
    },
    {
      id: "sweet-spot",
      name: "Sweet Spot",
      category: "Desserts",
      rating: 4.9,
      delivery: "15–25 min",
      fee: 10,
      description: "Desserts, cakes and sweet little treats.",
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80",
      menu: [
        { id: "ss-cake", name: "Chocolate Cake", price: 85, emoji: "🍰", description: "Rich chocolate cake slice." },
        { id: "ss-cookie", name: "Chocolate Cookie", price: 35, emoji: "🍪", description: "Soft cookie with chocolate chips." }
      ]
    },
    {
      id: "fresh-sips",
      name: "Fresh Sips",
      category: "Drinks",
      rating: 4.4,
      delivery: "10–20 min",
      fee: 10,
      description: "Fresh juices, smoothies and iced drinks.",
      image: "https://images.unsplash.com/photo-1513558161293-cdaf765edfd7?auto=format&fit=crop&w=900&q=80",
      menu: [
        { id: "fs-orange", name: "Fresh Orange Juice", price: 45, emoji: "🍊", description: "Freshly squeezed orange juice." },
        { id: "fs-smoothie", name: "Berry Smoothie", price: 70, emoji: "🥤", description: "Mixed berries blended smooth." }
      ]
    }
  ];

  function read(key, fallback) {
    try {
      const v = JSON.parse(localStorage.getItem(key));
      return v == null ? fallback : v;
    } catch {
      return fallback;
    }
  }

  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function getCart() {
    const cart = read(CART_KEY, []);
    return Array.isArray(cart) ? cart : [];
  }

  function saveCart(cart) {
    write(CART_KEY, cart);
    updateCartBadge();
  }

  function getOrders() {
    const orders = read(ORDERS_KEY, []);
    return Array.isArray(orders) ? orders : [];
  }

  function getUser() {
    return read(USER_KEY, null);
  }

  function money(value) {
    return `${Number(value || 0).toFixed(2)} EGP`;
  }

  function itemQty(item) {
    return Number(item.quantity ?? item.qty ?? 1);
  }

  function cartCount() {
    return getCart().reduce((n, item) => n + itemQty(item), 0);
  }

  function updateCartBadge() {
    document.querySelectorAll("[data-cart-count]").forEach(el => el.textContent = cartCount());
  }

  function toast(message) {
    const el = document.getElementById("toast");
    if (!el) return;
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(window.__foodToast);
    window.__foodToast = setTimeout(() => el.classList.remove("show"), 2300);
  }

  function addToCart(restaurant, item) {
    const cart = getCart();
    const existing = cart.find(x => String(x.id) === String(item.id));
    if (existing) {
      existing.quantity = itemQty(existing) + 1;
    } else {
      cart.push({
        id: item.id,
        name: item.name,
        price: Number(item.price),
        quantity: 1,
        image: item.image || "",
        emoji: item.emoji || "🍽️",
        restaurantId: restaurant.id,
        restaurantName: restaurant.name
      });
    }
    saveCart(cart);
    toast(`${item.name} added to cart`);
  }

  function renderHeader() {
    const host = document.getElementById("site-header");
    if (!host) return;
    const current = location.pathname.split("/").pop() || "index.html";
    const links = [
      ["index.html", "Home"],
      ["restaurants.html", "Restaurants"],
      ["cart.html", "Cart"],
      ["orders.html", "My Orders"],
      ["profile.html", getUser()?.name ? "Profile" : "Log in"]
    ];
    host.innerHTML = `<div class="site-nav"><div class="nav-inner"><a class="brand" href="index.html"><span class="brand-mark">F</span> FoodApp</a><nav class="nav-links" aria-label="Main navigation">${links.map(([href, label]) => `<a class="${current === href ? 'active' : ''}" href="${href}">${label}${href === 'cart.html' ? ' <span class="cart-count" data-cart-count>0</span>' : ''}</a>`).join("")}</nav></div></div>`;
    updateCartBadge();
  }

  function restaurantCard(r) {
    return `<a class="restaurant-card" href="restaurant-details.html?id=${encodeURIComponent(r.id)}"><div class="restaurant-photo" style="background-image:url('${r.image}')"></div><div class="restaurant-body"><h3>${escapeHtml(r.name)}</h3><p>${escapeHtml(r.description)}</p><div class="restaurant-meta"><span class="rating">★ ${r.rating}</span><span>${r.delivery}</span><span>${r.fee === 0 ? 'Free delivery' : money(r.fee)}</span></div></div></a>`;
  }

  function escapeHtml(s) {
    return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function renderHome() {
    const categories = document.getElementById("category-list");
    if (categories) {
      categories.innerHTML = CATEGORIES.map(c => `<a class="category-card" href="restaurants.html?category=${encodeURIComponent(c.name)}"><span class="category-emoji">${c.emoji}</span><strong>${c.name}</strong></a>`).join("");
    }
    const popular = document.getElementById("popular-list");
    if (popular) {
      popular.innerHTML = RESTAURANTS.slice(0, 3).map(restaurantCard).join("");
    }
  }

  function renderRestaurants() {
    const list = document.getElementById("restaurant-list");
    if (!list) return;
    const filters = document.getElementById("filter-list");
    const queryEl = document.getElementById("restaurant-query");
    const params = new URLSearchParams(location.search);
    let activeCategory = params.get("category") || "All";
    queryEl.value = params.get("q") || "";

    function paint() {
      if (filters) {
        filters.innerHTML = ["All", ...CATEGORIES.map(c => c.name)].map(c => `<button type="button" class="filter-chip ${activeCategory === c ? 'active' : ''}" data-category="${c}">${c}</button>`).join("");
      }
      const q = queryEl.value.trim().toLowerCase();
      const result = RESTAURANTS.filter(r => (activeCategory === "All" || r.category === activeCategory) && (!q || `${r.name} ${r.category} ${r.description} ${r.menu.map(m => m.name).join(" ")}`.toLowerCase().includes(q)));
      list.innerHTML = result.map(restaurantCard).join("");
      document.getElementById("no-results")?.classList.toggle("hidden", result.length > 0);
    }

    filters?.addEventListener("click", e => {
      const b = e.target.closest("[data-category]");
      if (b) {
        activeCategory = b.dataset.category;
        paint();
      }
    });

    document.getElementById("restaurant-search")?.addEventListener("submit", e => {
      e.preventDefault();
      paint();
    });

    paint();
  }

  function renderRestaurantDetails() {
    const host = document.getElementById("restaurant-details");
    if (!host) return;
    const id = new URLSearchParams(location.search).get("id");
    const r = RESTAURANTS.find(x => x.id === id);
    if (!r) {
      host.innerHTML = '<div class="notice">Restaurant not found. <a class="text-link" href="restaurants.html">Browse restaurants</a></div>';
      return;
    }
    host.innerHTML = `<a class="text-link" href="restaurants.html">← All restaurants</a><section class="detail-hero"><div class="detail-photo" style="background-image:url('${r.image}')"></div><div><p class="eyebrow">${r.category}</p><h1>${escapeHtml(r.name)}</h1><p>${escapeHtml(r.description)}</p><p><span class="rating">★ ${r.rating}</span> · ${r.delivery} · Delivery ${money(r.fee)}</p></div></section><section class="section"><div class="section-heading"><h2>Menu</h2><a class="text-link" href="cart.html">View cart →</a></div><div class="menu-grid">${r.menu.map(item => `<article class="menu-item"><div class="menu-emoji">${item.emoji}</div><div class="menu-item-info"><h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.description)}</p><span class="menu-price">${money(item.price)}</span></div><button class="add-btn" data-add="${item.id}">+ Add</button></article>`).join("")}</div></section>`;
    
    host.addEventListener("click", e => {
      const b = e.target.closest("[data-add]");
      if (!b) return;
      const item = r.menu.find(m => m.id === b.dataset.add);
      if (item) addToCart(r, item);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderHeader();
    renderHome();
    renderRestaurants();
    renderRestaurantDetails();
  });

  return {
    CATEGORIES,
    RESTAURANTS,
    CART_KEY,
    ORDERS_KEY,
    USER_KEY,
    PROMO_KEY,
    DELIVERY_FEE,
    PROMOS,
    read,
    write,
    getCart,
    saveCart,
    getOrders,
    getUser,
    money,
    itemQty,
    cartCount,
    updateCartBadge,
    toast,
    addToCart,
    escapeHtml
  };
})();