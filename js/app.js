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
      delivery: "30-45 min",
      fee: 15,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80",
      description: "Juicy gourmet burgers and crispy fries.",
      menu: [
        { id: "bh-classic", name: "Classic Beef Burger", price: 145, emoji: "🍔", description: "Beef patty, lettuce, tomato and house sauce." },
        { id: "bh-cheese", name: "Double Cheese Burger", price: 185, emoji: "🍔", description: "Double beef, cheddar and pickles." },
        { id: "bh-fries", name: "Crispy Fries", price: 55, emoji: "🍟", description: "Golden fries with a pinch of salt." },
        { id: "bh-bbq", name: "BBQ Beef Burger", price: 175, emoji: "🍔", description: "Beef patty, smoky BBQ sauce and melted cheese." },
        { id: "bh-crispy", name: "Crispy Chicken Burger", price: 135, emoji: "🍔", description: "Crispy chicken, lettuce and creamy sauce." },
        { id: "bh-spicy", name: "Spicy Chicken Burger", price: 145, emoji: "🍔", description: "Spicy crispy chicken with signature sauce." },
        { id: "bh-mushroom", name: "Mushroom Swiss Burger", price: 180, emoji: "🍔", description: "Beef burger topped with mushrooms and Swiss cheese." },
        { id: "bh-zinger", name: "Zinger Burger", price: 140, emoji: "🍔", description: "Crunchy spicy chicken with fresh lettuce." },
        { id: "bh-loaded-fries", name: "Loaded Cheese Fries", price: 85, emoji: "🍟", description: "Crispy fries topped with melted cheese." },
        { id: "bh-nuggets", name: "Chicken Nuggets", price: 90, emoji: "🍗", description: "Golden chicken nuggets served with dip." },
        { id: "bh-onion", name: "Onion Rings", price: 65, emoji: "🧅", description: "Crispy battered onion rings." }
      ]
    },
    {
      id: "mama-kitchen",
      name: "Mama Kitchen",
      category: "Healthy",
      rating: 4.6,
      delivery: "25-40 min",
      fee: 10,
      image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80",
      description: "Fresh homemade meals and healthy bowls.",
      menu: [
        { id: "mk-chicken", name: "Grilled Chicken Bowl", price: 135, emoji: "🍗", description: "Grilled chicken, rice and seasonal vegetables." },
        { id: "mk-salad", name: "Fresh Garden Salad", price: 75, emoji: "🥗", description: "Crisp greens, tomatoes and house dressing." },
        { id: "mk-pasta", name: "Creamy Pasta", price: 120, emoji: "🍝", description: "Creamy sauce with herbs and parmesan." },
        { id: "mk-alfredo", name: "Chicken Alfredo Pasta", price: 145, emoji: "🍝", description: "Creamy pasta with chicken and parmesan." },
        { id: "mk-kofta", name: "Beef Kofta Rice Bowl", price: 150, emoji: "🍚", description: "Seasoned beef kofta served with rice." },
        { id: "mk-strips", name: "Crispy Chicken Strips", price: 110, emoji: "🍗", description: "Crispy chicken strips with dipping sauce." },
        { id: "mk-shawarma", name: "Chicken Shawarma Plate", price: 140, emoji: "🍗", description: "Chicken shawarma with rice and garlic sauce." },
        { id: "mk-fajita", name: "Chicken Fajita Rice", price: 135, emoji: "🍚", description: "Seasoned chicken, peppers and rice." },
        { id: "mk-mac", name: "Baked Mac and Cheese", price: 115, emoji: "🧀", description: "Baked macaroni with a creamy cheese sauce." },
        { id: "mk-steak", name: "Beef Steak Plate", price: 220, emoji: "🥩", description: "Grilled beef steak with mashed potatoes." }
      ]
    },
    {
      id: "pizza-corner",
      name: "Pizza Corner",
      category: "Pizza",
      rating: 4.9,
      delivery: "35-50 min",
      fee: 20,
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=80",
      description: "Authentic Italian pizzas baked to perfection.",
      menu: [
        { id: "pc-margherita", name: "Margherita Pizza", price: 130, emoji: "🍕", description: "Tomato, mozzarella and fresh basil." },
        { id: "pc-pepperoni", name: "Pepperoni Pizza", price: 175, emoji: "🍕", description: "Pepperoni, mozzarella and tomato sauce." },
        { id: "pc-garlic", name: "Garlic Bread", price: 50, emoji: "🥖", description: "Warm bread with garlic butter." },
        { id: "pc-ranch", name: "Chicken Ranch Pizza", price: 165, emoji: "🍕", description: "Chicken, ranch sauce and mozzarella." },
        { id: "pc-four-cheese", name: "Four Cheese Pizza", price: 190, emoji: "🍕", description: "A blend of four delicious cheeses." },
        { id: "pc-bbq", name: "BBQ Chicken Pizza", price: 175, emoji: "🍕", description: "BBQ chicken, onions and mozzarella." },
        { id: "pc-supreme", name: "Supreme Pizza", price: 200, emoji: "🍕", description: "A generous mix of vegetables and meat toppings." },
        { id: "pc-veggie", name: "Vegetable Pizza", price: 140, emoji: "🍕", description: "Bell peppers, mushrooms, olives and cheese." },
        { id: "pc-spicy-beef", name: "Spicy Beef Pizza", price: 185, emoji: "🍕", description: "Seasoned beef with spicy sauce." },
        { id: "pc-mushroom", name: "Mushroom Pizza", price: 155, emoji: "🍕", description: "Mushrooms, mozzarella and tomato sauce." }
      ]
    },
    {
      id: "noodle-bar",
      name: "Noodle Bar",
      category: "Asian",
      rating: 4.7,
      delivery: "25-35 min",
      fee: 15,
      image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1000&q=80",
      description: "Delicious Asian noodles and ramen bowls.",
      menu: [
        { id: "nr-noodles", name: "Chicken Noodles", price: 125, emoji: "🍜", description: "Noodles with chicken and vegetables." },
        { id: "nr-dumplings", name: "Steamed Dumplings", price: 90, emoji: "🥟", description: "Six dumplings with dipping sauce." },
        { id: "nr-beef", name: "Beef Noodles", price: 145, emoji: "🍜", description: "Stir-fried noodles with tender beef." },
        { id: "nr-shrimp", name: "Shrimp Noodles", price: 165, emoji: "🍜", description: "Noodles with shrimp and vegetables." },
        { id: "nr-veggie", name: "Vegetable Noodles", price: 105, emoji: "🍜", description: "Wok-fried noodles with fresh vegetables." },
        { id: "nr-ramen", name: "Chicken Ramen", price: 155, emoji: "🍜", description: "Chicken ramen served in a savory broth." },
        { id: "nr-korean", name: "Spicy Korean Noodles", price: 135, emoji: "🌶️", description: "Spicy noodles with a Korean-inspired sauce." },
        { id: "nr-pad-thai", name: "Chicken Pad Thai", price: 150, emoji: "🍜", description: "Thai-style noodles with chicken and peanuts." },
        { id: "nr-teriyaki", name: "Beef Teriyaki Bowl", price: 165, emoji: "🍚", description: "Beef teriyaki served with steamed rice." }
      ]
    },
    {
      id: "sweet-spot",
      name: "Sweet Spot",
      category: "Desserts",
      rating: 4.9,
      delivery: "20-30 min",
      fee: 10,
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=80",
      description: "Cakes, cookies, and delicious sweet treats.",
      menu: [
        { id: "ss-cake", name: "Chocolate Cake", price: 85, emoji: "🍰", description: "Rich chocolate cake slice." },
        { id: "ss-cookie", name: "Chocolate Cookie", price: 35, emoji: "🍪", description: "Soft cookie with chocolate chips." },
        { id: "ss-cheesecake", name: "New York Cheesecake", price: 95, emoji: "🍰", description: "Creamy cheesecake with a buttery biscuit base." },
        { id: "ss-brownie", name: "Chocolate Brownies", price: 55, emoji: "🍫", description: "Rich chocolate brownies with a fudgy center." },
        { id: "ss-pancakes", name: "Classic Pancakes", price: 75, emoji: "🥞", description: "Fluffy pancakes served with syrup." },
        { id: "ss-red-velvet", name: "Red Velvet Cake", price: 90, emoji: "🍰", description: "Soft red velvet cake with cream cheese frosting." },
        { id: "ss-cookies", name: "Chocolate Chip Cookies", price: 40, emoji: "🍪", description: "Fresh cookies filled with chocolate chips." },
        { id: "ss-cinnamon", name: "Cinnamon Rolls", price: 65, emoji: "🥮", description: "Soft cinnamon rolls with sweet glaze." },
        { id: "ss-tiramisu", name: "Tiramisu", price: 95, emoji: "🍮", description: "Coffee-flavored dessert layered with cream." }
      ]
    },
    {
      id: "fresh-sips",
      name: "Fresh Sips",
      category: "Drinks",
      rating: 4.7,
      delivery: "15-25 min",
      fee: 5,
      image: "https://images.unsplash.com/photo-1513558161293-cdaf765edfd7?auto=format&fit=crop&w=1000&q=80",
      description: "Refreshing juices, smoothies and iced coffees.",
      menu: [
        { id: "fs-orange", name: "Fresh Orange Juice", price: 45, emoji: "🍊", description: "Freshly squeezed orange juice." },
        { id: "fs-smoothie", name: "Berry Smoothie", price: 70, emoji: "🥤", description: "Mixed berries blended smooth." },
        { id: "fs-mango", name: "Mango Smoothie", price: 65, emoji: "🥭", description: "Smooth mango blended with milk." },
        { id: "fs-strawberry", name: "Strawberry Milkshake", price: 75, emoji: "🍓", description: "Creamy strawberry milkshake." },
        { id: "fs-lemonade", name: "Fresh Lemonade", price: 40, emoji: "🍋", description: "Refreshing lemonade served chilled." },
        { id: "fs-watermelon", name: "Watermelon Juice", price: 45, emoji: "🍉", description: "Fresh watermelon juice." },
        { id: "fs-berry", name: "Mixed Berry Smoothie", price: 75, emoji: "🫐", description: "A blend of mixed berries and yogurt." },
        { id: "fs-latte", name: "Iced Caramel Latte", price: 80, emoji: "🧋", description: "Iced coffee with milk and caramel." },
        { id: "fs-pineapple", name: "Pineapple Juice", price: 50, emoji: "🍍", description: "Sweet tropical pineapple juice." }
      ]
    }
  ];

  const FOOD_IMAGES = {
    "bh-classic": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80",
    "bh-cheese": "https://images.unsplash.com/photo-1553979459-d2229ba7433a?auto=format&fit=crop&w=700&q=80",
    "bh-fries": "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=700&q=80",
    "bh-bbq": "https://images.unsplash.com/photo-1553979459-d2229ba7433a?auto=format&fit=crop&w=700&q=80",
    "bh-crispy": "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=700&q=80",
    "bh-spicy": "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=700&q=80",
    "bh-mushroom": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80",
    "bh-zinger": "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=700&q=80",
    "bh-loaded-fries": "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=700&q=80",
    "bh-nuggets": "https://images.unsplash.com/photo-1562967916-eb82221dfb92?auto=format&fit=crop&w=700&q=80",
    "bh-onion": "https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&w=700&q=80",

    "mk-chicken": "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=700&q=80",
    "mk-salad": "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=700&q=80",
    "mk-pasta": "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=700&q=80",
    "mk-alfredo": "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=700&q=80",
    "mk-kofta": "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=700&q=80",
    "mk-strips": "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=700&q=80",
    "mk-shawarma": "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=700&q=80",
    "mk-fajita": "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=700&q=80",
    "mk-mac": "https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?auto=format&fit=crop&w=700&q=80",
    "mk-steak": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80",

    "pc-margherita": "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=700&q=80",
    "pc-pepperoni": "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=700&q=80",
    "pc-garlic": "https://images.unsplash.com/photo-1619531040576-f94167406618?auto=format&fit=crop&w=700&q=80",
    "pc-ranch": "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=700&q=80",
    "pc-four-cheese": "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=700&q=80",
    "pc-bbq": "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=700&q=80",
    "pc-supreme": "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=80",
    "pc-veggie": "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=700&q=80",
    "pc-spicy-beef": "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=700&q=80",
    "pc-mushroom": "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=80",

    "nr-noodles": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=700&q=80",
    "nr-dumplings": "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=700&q=80",
    "nr-beef": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=700&q=80",
    "nr-shrimp": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=700&q=80",
    "nr-veggie": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=700&q=80",
    "nr-ramen": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=700&q=80",
    "nr-korean": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=700&q=80",
    "nr-pad-thai": "https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=700&q=80",
    "nr-teriyaki": "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=700&q=80",

    "ss-cake": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=700&q=80",
    "ss-cookie": "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=700&q=80",
    "ss-cheesecake": "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=700&q=80",
    "ss-brownie": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=700&q=80",
    "ss-pancakes": "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=700&q=80",
    "ss-red-velvet": "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=700&q=80",
    "ss-cookies": "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=700&q=80",
    "ss-cinnamon": "https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=700&q=80",
    "ss-tiramisu": "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=700&q=80",

    "fs-orange": "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=700&q=80",
    "fs-smoothie": "https://images.unsplash.com/photo-1505252585461-04db1f6d4d7e?auto=format&fit=crop&w=700&q=80",
    "fs-mango": "https://images.unsplash.com/photo-1505252585461-04db1f6d4d7e?auto=format&fit=crop&w=700&q=80",
    "fs-strawberry": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=700&q=80",
    "fs-lemonade": "https://images.unsplash.com/photo-1513558161293-cdaf765edfd7?auto=format&fit=crop&w=700&q=80",
    "fs-watermelon": "https://images.unsplash.com/photo-1525385133512-2f3bdd039054?auto=format&fit=crop&w=700&q=80",
    "fs-berry": "https://images.unsplash.com/photo-1505252585461-04db1f6d4d7e?auto=format&fit=crop&w=700&q=80",
    "fs-latte": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=700&q=80",
    "fs-pineapple": "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=700&q=80"
  };

  function read(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value == null ? fallback : value;
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
    return getCart().reduce((total, item) => total + itemQty(item), 0);
  }

  function updateCartBadge() {
    document.querySelectorAll("[data-cart-count]").forEach(element => {
      element.textContent = cartCount();
    });
  }

  function toast(message) {
    const element = document.getElementById("toast");
    if (!element) return;

    element.textContent = message;
    element.classList.add("show");

    clearTimeout(window.__foodToast);

    window.__foodToast = setTimeout(() => {
      element.classList.remove("show");
    }, 2300);
  }

  function addToCart(restaurant, item) {
    const cart = getCart();

    const existing = cart.find(
      product => String(product.id) === String(item.id)
    );

    if (existing) {
      existing.quantity = itemQty(existing) + 1;
    } else {
      cart.push({
        id: item.id,
        name: item.name,
        price: Number(item.price),
        quantity: 1,
        image: FOOD_IMAGES[item.id] || "",
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

    host.innerHTML = `
      <div class="site-nav">
        <div class="nav-inner">
          <a class="brand" href="index.html">
            <span class="brand-mark">F</span> FoodApp
          </a>

          <nav class="nav-links" aria-label="Main navigation">
            ${links.map(([href, label]) => `
              <a class="${current === href ? "active" : ""}" href="${href}">
                ${label}
                ${href === "cart.html"
                  ? '<span class="cart-count" data-cart-count>0</span>'
                  : ""}
              </a>
            `).join("")}
          </nav>
        </div>
      </div>
    `;

    updateCartBadge();
  }

  function restaurantCard(restaurant) {
    return `
      <a class="restaurant-card"
         href="restaurant-details.html?id=${encodeURIComponent(restaurant.id)}">

        <div class="restaurant-photo"
             style="background-image:url('${restaurant.image}')">
        </div>

        <div class="restaurant-body">
          <h3>${escapeHtml(restaurant.name)}</h3>
          <p>${escapeHtml(restaurant.description)}</p>

          <div class="restaurant-meta">
            <span class="rating">★ ${restaurant.rating}</span>
            <span>${restaurant.delivery}</span>
            <span>
              ${restaurant.fee === 0
                ? "Free delivery"
                : money(restaurant.fee)}
            </span>
          </div>
        </div>
      </a>
    `;
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[character]));
  }

  function renderHome() {
    const categories = document.getElementById("category-list");

    if (categories) {
      categories.innerHTML = CATEGORIES.map(category => `
        <a class="category-card"
           href="restaurants.html?category=${encodeURIComponent(category.name)}">
          <span class="category-emoji">${category.emoji}</span>
          <strong>${category.name}</strong>
        </a>
      `).join("");
    }

    const popular = document.getElementById("popular-list");

    if (popular) {
      popular.innerHTML = RESTAURANTS
        .slice(0, 3)
        .map(restaurantCard)
        .join("");
    }
  }

  function renderRestaurants() {
    const list = document.getElementById("restaurant-list");
    if (!list) return;

    const filters = document.getElementById("filter-list");
    const queryElement = document.getElementById("restaurant-query");
    const params = new URLSearchParams(location.search);

    let activeCategory = params.get("category") || "All";

    if (queryElement) {
      queryElement.value = params.get("q") || "";
    }

    function paint() {
      if (filters) {
        filters.innerHTML = ["All", ...CATEGORIES.map(c => c.name)]
          .map(category => `
            <button type="button"
                    class="filter-chip ${activeCategory === category ? "active" : ""}"
                    data-category="${category}">
              ${category}
            </button>
          `).join("");
      }

      const query = queryElement
        ? queryElement.value.trim().toLowerCase()
        : "";

      const results = RESTAURANTS.filter(restaurant => {
        const categoryMatches =
          activeCategory === "All" ||
          restaurant.category === activeCategory;

        const searchableText = `
          ${restaurant.name}
          ${restaurant.category}
          ${restaurant.description}
          ${restaurant.menu.map(item => item.name).join(" ")}
        `.toLowerCase();

        return categoryMatches &&
          (!query || searchableText.includes(query));
      });

      list.innerHTML = results.map(restaurantCard).join("");

      document.getElementById("no-results")
        ?.classList.toggle("hidden", results.length > 0);
    }

    filters?.addEventListener("click", event => {
      const button = event.target.closest("[data-category]");

      if (button) {
        activeCategory = button.dataset.category;
        paint();
      }
    });

    document.getElementById("restaurant-search")
      ?.addEventListener("submit", event => {
        event.preventDefault();
        paint();
      });

    paint();
  }

  function renderRestaurantDetails() {
    const host = document.getElementById("restaurant-details");
    if (!host) return;

    const id = new URLSearchParams(location.search).get("id");
    const restaurant = RESTAURANTS.find(item => item.id === id);

    if (!restaurant) {
      host.innerHTML = `
        <div class="notice">
          Restaurant not found.
          <a class="text-link" href="restaurants.html">
            Browse restaurants
          </a>
        </div>
      `;
      return;
    }

    host.innerHTML = `
      <a class="text-link" href="restaurants.html">
        ← All restaurants
      </a>

      <section class="detail-hero">
        <div class="detail-photo"
             style="background-image:url('${restaurant.image}')">
        </div>

        <div>
          <p class="eyebrow">${restaurant.category}</p>
          <h1>${escapeHtml(restaurant.name)}</h1>
          <p>${escapeHtml(restaurant.description)}</p>
          <p>
            <span class="rating">★ ${restaurant.rating}</span>
            · ${restaurant.delivery}
            · Delivery ${money(restaurant.fee)}
          </p>
        </div>
      </section>

      <section class="section">
        <div class="section-heading">
          <h2>Menu</h2>
          <a class="text-link" href="cart.html">View cart →</a>
        </div>

        <div class="menu-grid">
          ${restaurant.menu.map(item => {
            const image = FOOD_IMAGES[item.id];

            return `
              <article class="menu-item">
                <div class="menu-emoji">
                  <img
                    src="${image}"
                    alt="${escapeHtml(item.name)}"
                    loading="lazy"
                    style="width:100%;height:100%;object-fit:cover;border-radius:12px;"
                    onerror="this.style.display='none';this.parentElement.textContent='${item.emoji || "🍽️"}'"
                  >
                </div>

                <div class="menu-item-info">
                  <h3>${escapeHtml(item.name)}</h3>
                  <p>${escapeHtml(item.description)}</p>
                  <span class="menu-price">${money(item.price)}</span>
                </div>

                <button class="add-btn" data-add="${item.id}">
                  + Add
                </button>
              </article>
            `;
          }).join("")}
        </div>
      </section>
    `;

    host.addEventListener("click", event => {
      const button = event.target.closest("[data-add]");
      if (!button) return;

      const item = restaurant.menu.find(
        menuItem => menuItem.id === button.dataset.add
      );

      if (item) {
        addToCart(restaurant, item);
      }
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