"use strict";

/* ---------- 1. Config ---------- */
const CART_KEY = "cart";
const ORDERS_KEY = "orders";
const USER_KEY = "currentUser";
const PROMO_KEY = "appliedPromo";

const CURRENCY = "EGP";
const DEFAULT_DELIVERY_FEE = 15; // used when cart items carry no deliveryFee
const MAX_QTY = 99;
const PROMO_CODES = { WELCOME10: 10, FOOD20: 20 }; // code -> % discount

const PLACEHOLDER_IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect width="100%" height="100%" fill="#f1ecea"/><text x="50%" y="58%" font-size="44" text-anchor="middle">🍽️</text></svg>'
  );

const ICON_TRASH =
  '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>';

/* ---------- 2. Storage & formatting helpers ---------- */
function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    showToast("Could not save data in this browser.", "error");
    return false;
  }
}

/** Converts "50", 50 or "50 EGP" into a number (0 if it can't be read). */
function toNumber(value) {
  if (typeof value === "number") return isFinite(value) ? value : 0;
  const n = parseFloat(String(value ?? "").replace(/[^\d.]/g, ""));
  return isNaN(n) ? 0 : n;
}

/**
 * Reads the cart and silently drops any broken rows.
 * Also accepts a few alternative field names (title / img / image_url)
 * so integration with other pages is more forgiving.
 */
function getCart() {
  const raw = readJSON(CART_KEY, []);
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((it) => it && it.id != null && (it.name || it.title))
    .map((it) => ({
      ...it,
      name: it.name || it.title,
      image: it.image || it.img || it.image_url || "",
      price: toNumber(it.price),
      quantity: Math.max(1, Math.min(MAX_QTY, parseInt(it.quantity, 10) || 1)),
    }));
}

function saveCart(cart) {
  writeJSON(CART_KEY, cart);
}

function getPromo() {
  const p = readJSON(PROMO_KEY, null);
  return p && PROMO_CODES[p.code] ? { code: p.code, percent: PROMO_CODES[p.code] } : null;
}

function formatPrice(n) {
  return (Number(n) || 0).toFixed(2) + " " + CURRENCY;
}

/** Escapes text for safe use inside HTML content AND attributes. */
function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/* ---------- 3. Pricing ---------- */
function calculateSummary(cart) {
  const subtotal = cart.reduce((sum, it) => sum + it.price * it.quantity, 0);

  let deliveryFee = 0;
  if (cart.length) {
    const fees = cart
      .map((it) => it.deliveryFee)
      .filter((f) => f !== undefined && f !== null && f !== "" && !isNaN(Number(f)))
      .map(Number);
    deliveryFee = fees.length ? Math.max(...fees) : DEFAULT_DELIVERY_FEE;
  }

  const promo = getPromo();
  const discount = promo ? +(subtotal * (promo.percent / 100)).toFixed(2) : 0;
  const total = Math.max(0, +(subtotal + deliveryFee - discount).toFixed(2));

  return { subtotal, deliveryFee, discount, total, promo };
}

function renderSummary(container) {
  const s = calculateSummary(getCart());
  container.innerHTML = `
    <h3>Order Summary</h3>
    <div class="sum-row"><span>Subtotal</span><span>${formatPrice(s.subtotal)}</span></div>
    <div class="sum-row"><span>Delivery Fee</span><span>${formatPrice(s.deliveryFee)}</span></div>
    ${
      s.discount > 0
        ? `<div class="sum-row discount"><span>Discount (${esc(s.promo.code)} · ${s.promo.percent}%)</span><span>− ${formatPrice(s.discount)}</span></div>`
        : ""
    }
    <div class="sum-row total"><span>Total</span><span>${formatPrice(s.total)}</span></div>`;
  return s;
}

/* ---------- 4. UI helpers ---------- */
const $ = (id) => document.getElementById(id);

function updateCartBadge() {
  const count = getCart().reduce((n, it) => n + it.quantity, 0);
  document.querySelectorAll(".cart-badge").forEach((b) => (b.textContent = count));
}

function showToast(message, type) {
  const toast = $("toast");
  toast.textContent = message;
  toast.className = "toast show " + (type || "");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => (toast.className = "toast"), 2600);
}

const views = { cart: $("view-cart"), checkout: $("view-checkout"), done: $("view-success") };
const stepOrder = ["cart", "checkout", "done"];

function showView(name) {
  Object.entries(views).forEach(([key, el]) => (el.hidden = key !== name));

  // stepper state
  const current = stepOrder.indexOf(name);
  document.querySelectorAll(".step").forEach((el) => {
    const i = stepOrder.indexOf(el.dataset.step);
    el.classList.toggle("active", i === current);
    el.classList.toggle("done", i < current);
    const dot = el.querySelector(".dot");
    dot.textContent = i < current ? "✓" : String(i + 1);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---------- 5. Cart view ---------- */
const itemsBox = $("cart-items");
const emptyBox = $("cart-empty");
const contentBox = $("cart-content");
const promoInput = $("promo-input");
const promoMsg = $("promo-msg");

function renderCart() {
  const cart = getCart();
  updateCartBadge();

  if (cart.length === 0) {
    contentBox.hidden = true;
    emptyBox.hidden = false;
    $("cart-count-label").textContent = "";
    return;
  }

  emptyBox.hidden = true;
  contentBox.hidden = false;

  const count = cart.reduce((n, it) => n + it.quantity, 0);
  $("cart-count-label").textContent = `${count} item${count > 1 ? "s" : ""}`;

  itemsBox.innerHTML = cart
    .map(
      (it) => `
    <div class="cart-item" role="listitem" data-id="${esc(it.id)}">
      <img src="${esc(it.image || PLACEHOLDER_IMG)}" alt="${esc(it.name)}" loading="lazy"
           onerror="this.onerror=null;this.src='${PLACEHOLDER_IMG}'">
      <div class="info">
        <h4>${esc(it.name)}</h4>
        ${it.restaurantName ? `<small>${esc(it.restaurantName)}</small>` : ""}
        <p class="unit">${formatPrice(it.price)} each</p>
      </div>
      <div class="qty" role="group" aria-label="Quantity for ${esc(it.name)}">
        <button type="button" class="qty-btn" data-action="dec" aria-label="Decrease quantity">−</button>
        <span class="qty-val" aria-live="polite">${it.quantity}</span>
        <button type="button" class="qty-btn" data-action="inc" aria-label="Increase quantity" ${
          it.quantity >= MAX_QTY ? "disabled" : ""
        }>+</button>
      </div>
      <div class="line-total">${formatPrice(it.price * it.quantity)}</div>
      <button type="button" class="remove-btn" data-action="remove" aria-label="Remove ${esc(it.name)}" title="Remove">${ICON_TRASH}</button>
    </div>`
    )
    .join("");

  renderSummary($("cart-summary"));
}

itemsBox.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn || btn.disabled) return;

  const id = btn.closest(".cart-item").dataset.id;
  const cart = getCart();
  const idx = cart.findIndex((it) => String(it.id) === id);
  if (idx === -1) return;

  const action = btn.dataset.action;
  if (action === "inc") {
    cart[idx].quantity = Math.min(MAX_QTY, cart[idx].quantity + 1);
  } else if (action === "dec") {
    cart[idx].quantity -= 1;
    if (cart[idx].quantity <= 0) {
      const [removed] = cart.splice(idx, 1);
      showToast(`${removed.name} removed from cart`);
    }
  } else if (action === "remove") {
    const [removed] = cart.splice(idx, 1);
    showToast(`${removed.name} removed from cart`);
  }

  saveCart(cart);
  renderCart();
});

$("clear-cart").addEventListener("click", () => {
  if (!getCart().length) return;
  if (window.confirm("Remove all items from your cart?")) {
    saveCart([]);
    localStorage.removeItem(PROMO_KEY);
    promoMsg.textContent = "";
    renderCart();
    showToast("Cart cleared");
  }
});

/* Promo code */
$("promo-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const code = promoInput.value.trim().toUpperCase();
  if (!code) return;

  if (PROMO_CODES[code]) {
    writeJSON(PROMO_KEY, { code, percent: PROMO_CODES[code] });
    setPromoMessage(`Promo ${code} applied: ${PROMO_CODES[code]}% off`, "ok");
    promoInput.value = "";
  } else {
    setPromoMessage("Invalid promo code", "err");
  }
  renderCart();
});

function setPromoMessage(text, kind) {
  promoMsg.className = "promo-msg " + kind;
  promoMsg.textContent = text;
  if (kind === "ok") {
    const rm = document.createElement("button");
    rm.type = "button";
    rm.className = "link-btn";
    rm.textContent = "Remove";
    rm.addEventListener("click", () => {
      localStorage.removeItem(PROMO_KEY);
      promoMsg.textContent = "";
      renderCart();
    });
    promoMsg.appendChild(rm);
  }
}

$("checkout-btn").addEventListener("click", () => {
  if (getCart().length === 0) {
    showToast("Your cart is empty", "error");
    return;
  }
  openCheckout();
});

$("nav-cart").addEventListener("click", (e) => {
  e.preventDefault();
  renderCart();
  showView("cart");
});

/* ---------- 6. Checkout view ---------- */
const form = $("checkout-form");
const fields = ["fullName", "phone", "address"];

function openCheckout() {
  // Prefill from the logged-in user (Task 4) without overwriting what was typed
  const user = readJSON(USER_KEY, null);
  if (user) {
    if (user.fullName && !form.elements.fullName.value) form.elements.fullName.value = user.fullName;
    if (user.phone && !form.elements.phone.value) form.elements.phone.value = user.phone;
    if (user.address && !form.elements.address.value) form.elements.address.value = user.address;
  }

  $("items-preview").innerHTML = getCart()
    .map(
      (it) =>
        `<div class="sum-row"><span>${esc(it.name)} × ${it.quantity}</span><span>${formatPrice(
          it.price * it.quantity
        )}</span></div>`
    )
    .join("");
  renderSummary($("checkout-summary"));
  showView("checkout");
  form.elements.fullName.focus({ preventScroll: true });
}

$("back-btn").addEventListener("click", () => {
  renderCart();
  showView("cart");
});

/* Validation rules: each returns an error string, or "" when valid */
const rules = {
  fullName(v) {
    v = v.trim();
    if (!v) return "Full name is required.";
    if (v.length < 3) return "Name must be at least 3 characters.";
    if (/\d/.test(v)) return "Name should not contain numbers.";
    return "";
  },
  phone(v) {
    v = v.trim().replace(/[\s-]/g, "");
    if (!v) return "Phone number is required.";
    // Egyptian mobile: 01XXXXXXXXX, +201XXXXXXXXX or 00201XXXXXXXXX
    if (!/^(\+20|0020|0)?1[0125][0-9]{8}$/.test(v)) return "Enter a valid Egyptian mobile, e.g. 01012345678.";
    return "";
  },
  address(v) {
    v = v.trim();
    if (!v) return "Delivery address is required.";
    if (v.length < 8) return "Please enter a more detailed address.";
    return "";
  },
};

function validateField(name) {
  const input = form.elements[name];
  const msg = rules[name](input.value);
  $("err-" + name).textContent = msg;
  input.classList.toggle("invalid", !!msg);
  input.classList.toggle("valid", !msg && input.value.trim() !== "");
  input.setAttribute("aria-invalid", msg ? "true" : "false");
  return !msg;
}

fields.forEach((name) => {
  form.elements[name].addEventListener("blur", () => validateField(name));
  form.elements[name].addEventListener("input", () => {
    if (form.elements[name].classList.contains("invalid")) validateField(name);
  });
});

form.elements.notes.addEventListener("input", () => {
  $("notes-count").textContent = form.elements.notes.value.length;
});

function validateForm() {
  const results = fields.map((f) => ({ f, ok: validateField(f) }));
  const firstBad = results.find((r) => !r.ok);
  if (firstBad) form.elements[firstBad.f].focus();
  return !firstBad;
}

function normalizePhone(v) {
  const digits = v.replace(/[\s-]/g, "");
  return digits.replace(/^(\+20|0020)/, "0");
}

function generateOrderId() {
  // e.g. ORD-240915-4821  (date part + random 4 digits)
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const datePart = String(d.getFullYear()).slice(-2) + pad(d.getMonth() + 1) + pad(d.getDate());
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${datePart}-${rand}`;
}

let placing = false;

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (placing) return; // prevent double submit

  const cart = getCart();
  if (cart.length === 0) {
    showToast("Your cart is empty", "error");
    renderCart();
    showView("cart");
    return;
  }
  if (!validateForm()) {
    showToast("Please fix the highlighted fields", "error");
    return;
  }

  placing = true;
  const btn = $("place-btn");
  btn.disabled = true;
  btn.textContent = "Placing order…";

  // short delay so the user sees feedback (simulated request)
  setTimeout(() => {
    const s = calculateSummary(cart);
    const user = readJSON(USER_KEY, null);

    const order = {
      id: generateOrderId(),
      date: new Date().toISOString(),
      // links the order to the logged-in user (null if nobody is logged in)
      userId: user ? user.id ?? user.email ?? null : null,
      items: cart.map((it) => ({
        id: it.id,
        name: it.name,
        price: it.price,
        quantity: it.quantity,
        image: it.image || "",
      })),
      restaurantName: cart[0].restaurantName || "",
      subtotal: s.subtotal,
      deliveryFee: s.deliveryFee,
      discount: s.discount,
      total: s.total,
      status: "Pending", // Pending | Preparing | Out for Delivery | Delivered | Cancelled
      paymentMethod: form.elements.payment.value,
      customer: {
        name: form.elements.fullName.value.trim(),
        phone: normalizePhone(form.elements.phone.value),
        address: form.elements.address.value.trim(),
        notes: form.elements.notes.value.trim(),
      },
    };

    // make sure we always unshift into a real array
    const stored = readJSON(ORDERS_KEY, []);
    const orders = Array.isArray(stored) ? stored : [];
    orders.unshift(order); // newest first

    if (!writeJSON(ORDERS_KEY, orders)) {
      placing = false;
      btn.disabled = false;
      btn.textContent = "Place Order";
      return; // storage failed: keep the cart untouched
    }

    // success: clear the cart and any promo
    saveCart([]);
    localStorage.removeItem(PROMO_KEY);
    promoMsg.textContent = "";
    updateCartBadge();

    renderSuccess(order);
    form.reset();
    $("notes-count").textContent = "0";
    fields.forEach((f) => {
      form.elements[f].classList.remove("valid", "invalid");
      form.elements[f].removeAttribute("aria-invalid");
      $("err-" + f).textContent = "";
    });

    placing = false;
    btn.disabled = false;
    btn.textContent = "Place Order";

    showView("done");
    showToast("Order placed successfully!", "success");
  }, 500);
});

/* ---------- 7. Success view ---------- */
function renderSuccess(order) {
  $("order-id-text").textContent = order.id;

  const rows = order.items
    .map(
      (it) =>
        `<div class="sum-row"><span>${esc(it.name)} × ${it.quantity}</span><span>${formatPrice(
          it.price * it.quantity
        )}</span></div>`
    )
    .join("");

  $("order-recap").innerHTML = `
    ${rows}
    <div class="sum-row"><span>Delivery Fee</span><span>${formatPrice(order.deliveryFee)}</span></div>
    ${
      order.discount > 0
        ? `<div class="sum-row discount"><span style="color:var(--ok)">Discount</span><span style="color:var(--ok)">− ${formatPrice(order.discount)}</span></div>`
        : ""
    }
    <div class="sum-row total"><span>Total</span><span>${formatPrice(order.total)}</span></div>
    <div class="meta">
      <div><b>Deliver to:</b> ${esc(order.customer.address)}</div>
      <div><b>Payment:</b> ${esc(order.paymentMethod)}</div>
    </div>`;
}

$("copy-id").addEventListener("click", async () => {
  const id = $("order-id-text").textContent;
  try {
    await navigator.clipboard.writeText(id);
    showToast("Order ID copied", "success");
  } catch (err) {
    showToast("Could not copy automatically", "error");
  }
});

/* ---------- 8. Keep tabs in sync & start ---------- */
// If the cart changes in another tab/page (e.g. Add to Cart), refresh the cart view
window.addEventListener("storage", (e) => {
  if (e.key === CART_KEY || e.key === null) {
    updateCartBadge();
    if (!views.cart.hidden) renderCart();
  }
});

renderCart();
showView("cart");