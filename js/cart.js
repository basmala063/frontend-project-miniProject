
(() => {
  const A = FoodApp;
  const $ = id => document.getElementById(id);

  const cartView = $("cart-view");
  const checkoutView = $("checkout-view");
  const successView = $("success-view");

  if (!cartView || !checkoutView || !successView) return;

  let lastOrder = null;

  const getCart = () => A.getCart();
  const quantity = item => A.itemQty(item);

  const subtotal = () =>
    getCart().reduce(
      (sum, item) => sum + Number(item.price || 0) * quantity(item),
      0
    );

  const promoCode = () =>
    String(A.read(A.PROMO_KEY, "") || "").toUpperCase();

  const discount = () =>
    subtotal() * (Number(A.PROMOS[promoCode()] || 0) / 100);

  const total = () =>
    subtotal() - discount() + (getCart().length ? A.DELIVERY_FEE : 0);

  function summaryHTML() {
    return `
      <div class="summary-line">
        <span>Subtotal</span>
        <strong>${A.money(subtotal())}</strong>
      </div>

      <div class="summary-line">
        <span>Delivery fee</span>
        <strong>${A.money(getCart().length ? A.DELIVERY_FEE : 0)}</strong>
      </div>

      ${
        discount()
          ? `
            <div class="summary-line">
              <span>Discount (${A.PROMOS[promoCode()]}%)</span>
              <strong>−${A.money(discount())}</strong>
            </div>
          `
          : ""
      }

      <div class="summary-line total">
        <span>Total</span>
        <strong>${A.money(total())}</strong>
      </div>
    `;
  }

  function render() {
    const cart = getCart();

    const countLabel = $("cart-count-label");
    if (countLabel) {
      const count = A.cartCount();
      countLabel.textContent =
        `${count} item${count === 1 ? "" : "s"}`;
    }

    if ($("cart-empty")) {
      $("cart-empty").classList.toggle("hidden", cart.length > 0);
    }

    if ($("cart-content")) {
      $("cart-content").classList.toggle("hidden", cart.length === 0);
    }

    if ($("cart-items")) {
      $("cart-items").innerHTML = cart
        .map(item => `
          <article class="cart-row">
            <div class="cart-thumb">
              ${
                item.image
                  ? `<img src="${A.escapeHtml(item.image)}" alt="">`
                  : item.emoji || "🍽️"
              }
            </div>

            <div>
              <h3>${A.escapeHtml(item.name || item.title || "Food item")}</h3>
              <p class="muted">${A.money(item.price)} each</p>

              <div class="qty-controls">
                <button
                  type="button"
                  data-qty="-1"
                  data-id="${A.escapeHtml(String(item.id))}"
                  aria-label="Decrease quantity"
                >−</button>

                <strong>${quantity(item)}</strong>

                <button
                  type="button"
                  data-qty="1"
                  data-id="${A.escapeHtml(String(item.id))}"
                  aria-label="Increase quantity"
                >+</button>

                <button
                  type="button"
                  class="remove-item"
                  data-remove="${A.escapeHtml(String(item.id))}"
                >Remove</button>
              </div>
            </div>

            <strong class="price">
              ${A.money(Number(item.price || 0) * quantity(item))}
            </strong>
          </article>
        `)
        .join("");
    }

    if ($("cart-summary")) {
      $("cart-summary").innerHTML = summaryHTML();
    }

    if ($("checkout-summary")) {
      $("checkout-summary").innerHTML = summaryHTML();
    }

    if ($("items-preview")) {
      $("items-preview").innerHTML = cart
        .map(item => `
          <div class="summary-line">
            <span>
              ${A.escapeHtml(item.name || item.title || "Food item")}
              × ${quantity(item)}
            </span>
            <strong>
              ${A.money(Number(item.price || 0) * quantity(item))}
            </strong>
          </div>
        `)
        .join("");
    }

    if ($("promo-input")) {
      $("promo-input").value = promoCode();
    }
  }

  function showView(view) {
    cartView.classList.toggle("hidden", view !== "cart");
    checkoutView.classList.toggle("hidden", view !== "checkout");
    successView.classList.toggle("hidden", view !== "success");

    const activeStep = view === "success" ? "done" : view;

    ["cart", "checkout", "done"].forEach(name => {
      const step = $("step-" + name);
      if (step) {
        step.classList.toggle("active", name === activeStep);
      }
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showMessage(message, success = false) {
    let box = $("cart-message");

    if (!box) {
      box = document.createElement("p");
      box.id = "cart-message";
      box.setAttribute("role", "status");

      const form = $("promo-form");

      if (form) {
        form.insertAdjacentElement("afterend", box);
      } else if ($("cart-content")) {
        $("cart-content").prepend(box);
      }
    }

    box.textContent = message;
    box.classList.toggle("success-message", success);
    box.classList.toggle("error-message", !success);
  }

  const cartItems = $("cart-items");

  if (cartItems) {
    cartItems.addEventListener("click", e => {
      const button = e.target.closest("[data-qty], [data-remove]");
      if (!button) return;

      const cart = getCart();

      if (button.hasAttribute("data-qty")) {
        const item = cart.find(
          x => String(x.id) === button.dataset.id
        );

        if (!item) return;

        item.quantity = quantity(item) + Number(button.dataset.qty);

        if (item.quantity <= 0) {
          A.saveCart(cart.filter(x => x !== item));
        } else {
          A.saveCart(cart);
        }

        render();
      }

      if (button.hasAttribute("data-remove")) {
        A.saveCart(
          cart.filter(x => String(x.id) !== button.dataset.remove)
        );

        render();
      }
    });
  }

  const clearButton = $("clear-cart");

  if (clearButton) {
    clearButton.addEventListener("click", () => {
      A.saveCart([]);
      A.write(A.PROMO_KEY, "");
      render();
      showMessage("Your cart has been cleared.", true);
    });
  }

  const promoForm = $("promo-form");

  if (promoForm) {
    promoForm.addEventListener("submit", e => {
      e.preventDefault();

      const input = $("promo-input");
      const code = input ? input.value.trim().toUpperCase() : "";

      if (!code) {
        A.write(A.PROMO_KEY, "");
        render();
        showMessage("Enter a promo code first.");
        return;
      }

      if (A.PROMOS[code]) {
        A.write(A.PROMO_KEY, code);
        render();
        showMessage("Promo code applied successfully!", true);
      } else {
        A.write(A.PROMO_KEY, "");
        render();

        if (input) input.value = code;

        showMessage("Invalid promo code. Please try again.");
      }
    });
  }

  const checkoutButton = $("checkout-btn");

  if (checkoutButton) {
    checkoutButton.addEventListener("click", () => {
      if (getCart().length === 0) {
        showMessage("Your cart is empty. Add some food first.");
        return;
      }

      render();
      showView("checkout");
    });
  }

  const backButton = $("back-btn");

  if (backButton) {
    backButton.addEventListener("click", () => {
      showView("cart");
    });
  }

  const checkoutForm = $("checkout-form");

  if (checkoutForm) {
    checkoutForm.addEventListener("submit", e => {
      e.preventDefault();

      const cart = getCart();

      if (cart.length === 0) {
        showView("cart");
        showMessage("Your cart is empty.");
        return;
      }

      if (!checkoutForm.reportValidity()) return;

      const customer = {
        name: $("fullName").value.trim(),
        phone: $("phone").value.trim(),
        address: $("address").value.trim(),
        notes: $("notes").value.trim()
      };

      const paymentInput = checkoutForm.querySelector(
        'input[name="payment"]:checked'
      );

      const paymentMethod = paymentInput
        ? paymentInput.value
        : "Cash on Delivery";

      const order = {
        id: "ORD-" + Date.now(),
        date: new Date().toISOString(),
        items: cart.map(item => ({
          ...item,
          quantity: quantity(item)
        })),
        customer,
        paymentMethod,
        subtotal: subtotal(),
        deliveryFee: A.DELIVERY_FEE,
        discount: discount(),
        promoCode: promoCode(),
        total: total(),
        status: "Pending",
      };

      const ordersKey = A.ORDERS_KEY || "orders";
      const previousOrders = A.read(ordersKey, []);
      const orders = Array.isArray(previousOrders)
        ? previousOrders
        : [];

      orders.push(order);
      A.write(ordersKey, orders);

      lastOrder = order;

      const orderIdText = $("order-id-text");

      if (orderIdText) {
        orderIdText.textContent = order.id;
      }

      const orderRecap = $("order-recap");

      if (orderRecap) {
        orderRecap.innerHTML = `
          <h2>Order summary</h2>

          ${order.items.map(item => `
            <div class="summary-line">
              <span>
                ${A.escapeHtml(item.name || item.title || "Food item")}
                × ${item.quantity}
              </span>
              <strong>
                ${A.money(Number(item.price || 0) * item.quantity)}
              </strong>
            </div>
          `).join("")}

          <div class="summary-line">
            <span>Subtotal</span>
            <strong>${A.money(order.subtotal)}</strong>
          </div>

          <div class="summary-line">
            <span>Delivery fee</span>
            <strong>${A.money(order.deliveryFee)}</strong>
          </div>

          ${
            order.discount
              ? `
                <div class="summary-line">
                  <span>Discount</span>
                  <strong>−${A.money(order.discount)}</strong>
                </div>
              `
              : ""
          }

          <div class="summary-line total">
            <span>Total</span>
            <strong>${A.money(order.total)}</strong>
          </div>
        `;
      }

      A.saveCart([]);
      A.write(A.PROMO_KEY, "");

      checkoutForm.reset();
      render();
      showView("success");
    });
  }

  const continueButton = $("continue-shopping-btn");

  if (continueButton) {
    continueButton.addEventListener("click", () => {
      window.location.href = "restaurants.html";
    });
  }

  const viewOrdersButton = $("view-orders-btn");

  if (viewOrdersButton) {
    viewOrdersButton.addEventListener("click", () => {
      window.location.href = "orders.html";
    });
  }

  const copyButton = $("copy-id");

  if (copyButton) {
    copyButton.addEventListener("click", async () => {
      const orderId = $("order-id-text")?.textContent || "";

      if (!orderId) return;

      try {
        await navigator.clipboard.writeText(orderId);
        showMessage("Order ID copied successfully.", true);
      } catch {
        showMessage("Could not copy the order ID. Please copy it manually.");
      }
    });
  }

  render();
  showView("cart");
})();
