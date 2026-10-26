(() => {
  const A = FoodApp;
  const $ = id => document.getElementById(id);
  const cartView = $("cart-view");
  const checkoutView = $("checkout-view");
  const successView = $("success-view");
  if (!cartView) return;

  let lastOrder = null;
  const getCart = () => A.getCart();
  const quantity = item => A.itemQty(item);
  const subtotal = () => getCart().reduce((sum, item) => sum + Number(item.price || 0) * quantity(item), 0);
  const promoCode = () => String(A.read(A.PROMO_KEY, "") || "").toUpperCase();
  const discount = () => subtotal() * (Number(A.PROMOS[promoCode()] || 0) / 100);
  const total = () => subtotal() - discount() + (getCart().length ? A.DELIVERY_FEE : 0);

  function summaryHTML() {
    return `<div class="summary-line"><span>Subtotal</span><strong>${A.money(subtotal())}</strong></div><div class="summary-line"><span>Delivery fee</span><strong>${A.money(getCart().length ? A.DELIVERY_FEE : 0)}</strong></div>${discount() ? `<div class="summary-line"><span>Discount (${A.PROMOS[promoCode()]}\%)</span><strong>−${A.money(discount())}</strong></div>` : ""}<div class="summary-line total"><span>Total</span><strong>${A.money(total())}</strong></div>`;
  }

  function render() {
    const cart = getCart();
    $("cart-count-label").textContent = `${A.cartCount()} item${A.cartCount() === 1 ? "" : "s"}`;
    $("cart-empty").classList.toggle("hidden", cart.length > 0);
    $("cart-content").classList.toggle("hidden", cart.length === 0);

    $("cart-items").innerHTML = cart.map(item => `<article class="cart-row"><div class="cart-thumb">${item.image ? `<img src="${item.image}" alt="">` : item.emoji || "🍽️"}</div><div><h3>${A.escapeHtml(item.name || item.title || "Food item")}</h3><p class="muted">${A.money(item.price)} each</p><div class="qty-controls"><button data-qty="-1" data-id="${A.escapeHtml(item.id)}" aria-label="Decrease quantity">−</button><strong>${quantity(item)}</strong><button data-qty="1" data-id="${A.escapeHtml(item.id)}" aria-label="Increase quantity">+</button><button class="remove-item" data-remove="${A.escapeHtml(item.id)}">Remove</button></div></div><strong class="price">${A.money(Number(item.price || 0) * quantity(item))}</strong></article>`).join("");

    $("cart-summary").innerHTML = summaryHTML();
    $("checkout-summary").innerHTML = summaryHTML();
    $("items-preview").innerHTML = cart.map(item => `<div class="summary-line"><span>${A.escapeHtml(item.name)} × ${quantity(item)}</span><strong>${A.money(Number(item.price || 0) * quantity(item))}</strong></div>`).join("");
    $("promo-input").value = promoCode();
  }

  function showView(view) {
    cartView.classList.toggle("hidden", view !== "cart");
    checkoutView.classList.toggle("hidden", view !== "checkout");
    successView.classList.toggle("hidden", view !== "success");
    ["cart", "checkout", "done"].forEach((name, i) => $("step-" + name).classList.toggle("active", ["cart", "checkout", "done"][i] === ({ cart: "cart", checkout: "checkout", success: "done" }[view])));
  }

  $("cart-items").addEventListener("click", e => {
    const dec = e.target.closest("[data-qty]");
    const rem = e.target.closest("[data-remove]");
    if (dec) {
      const cart = getCart();
      const item = cart.find(x => String(x.id) === dec.dataset.id);
      if (item) {
        item.quantity = quantity(item) + Number(dec.dataset.qty);
        if (item.quantity <= 0) A.saveCart(cart.filter(x => x !== item));
        else A.saveCart(cart);
      }
      render();
    }
    if (rem) {
      A.saveCart(getCart().filter(x => String(x.id) !== rem.dataset.remove));
      render();
    }
  });

  $("clear-cart").addEventListener("click", () => {
    A.saveCart([]);
    A.write(A.PROMO_KEY, "");
    render();
  });

  $("promo-form").addEventListener("submit", e => {
    e.preventDefault();
    const code = $("promo-input").value.trim().toUpperCase();
    if (A.PROMOS[code]) {
      A.write(A.PROMO_KEY, code);
      $("promo-msg