(() => {
  const A = FoodApp;
  const $ = id => document.getElementById(id);
  const list = $("orders-list");
  const message = $("orders-message");
  const modal = $("details-modal");
  const details = $("order-details");

  function getOrders() {
    const x = A.read(A.ORDERS_KEY, []);
    return Array.isArray(x) ? x : [];
  }

  function date(v) {
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? "Date unavailable" : d.toLocaleString();
  }

  function total(o) {
    return o.total != null ? Number(o.total) || 0 : (o.items || []).reduce((s, i) => s + Number(i.price || 0) * A.itemQty(i), 0);
  }

  function render() {
    const orders = getOrders().sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    list.replaceChildren();
    message.classList.toggle("hidden", orders.length > 0);
    
    if (!orders.length) {
      message.innerHTML = 'You have no orders yet. <a class="text-link" href="restaurants.html">Explore restaurants</a> and order your favorite food.';
      return;
    }

    orders.forEach(o => {
      const card = document.createElement("article");
      card.className = "order-card";

      const top = document.createElement("div");
      top.className = "order-top";

      const info = document.createElement("div");
      info.innerHTML = `<p class="order-id">Order #${A.escapeHtml(o.id || "N/A")}</p><p class="order-date">${A.escapeHtml(date(o.date))}</p>`;

      const status = document.createElement("span");
      status.className = "status " + String(o.status || "Pending").toLowerCase().replace(/ /g, "-");
      status.textContent = o.status || "Pending";
      top.append(info, status);

      const items = document.createElement("div");
      items.className = "order-items";
      (o.items || []).forEach(i => {
        const p = document.createElement("p");
        p.textContent = `${i.name || i.title || "Food item"} × ${A.itemQty(i)}`;
        items.append(p);
      });

      const bottom = document.createElement("div");
      bottom.className = "order-bottom";

      const price = document.createElement("div");
      price.innerHTML = `<span class="muted">Order total</span><strong class="total-price">${A.money(total(o))}</strong>`;

      const actions = document.createElement("div");
      actions.className = "order-actions";

      const view = document.createElement("button");
      view.className = "button button-secondary";
      view.textContent = "View details";
      view.addEventListener("click", () => showDetails(o.id));
      actions.append(view);

      if ((o.status || "Pending") === "Pending") {
        const cancel = document.createElement("button");
        cancel.className = "button button-danger";
        cancel.textContent = "Cancel order";
        cancel.addEventListener("click", () => cancelOrder(o.id));
        actions.append(cancel);
      }

      bottom.append(price, actions);
      card.append(top, items, bottom);
      list.append(card);
    });
  }

  function row(label, value) {
    const el = document.createElement("div");
    el.className = "detail-row";
    const l = document.createElement("span");
    const v = document.createElement("strong");
    l.textContent = label;
    v.textContent = value || "Not provided";
    el.append(l, v);
    details.append(el);
  }

  function showDetails(id) {
    const o = getOrders().find(x => String(x.id) === String(id));
    if (!o) return;

    details.replaceChildren();
    row("Order ID", "#" + (o.id || "N/A"));
    row("Date", date(o.date));
    row("Status", o.status || "Pending");
    row("Delivery address", o.customer?.address || o.address || "No address provided");
    row("Phone", o.customer?.phone || "No phone provided");
    row("Payment", o.paymentMethod || "Not specified");

    const h = document.createElement("h3");
    h.textContent = "Ordered items";
    details.append(h);

    (o.items || []).forEach(i => row(`${i.name || i.title || "Food item"} × ${A.itemQty(i)}`, A.money(Number(i.price || 0) * A.itemQty(i))));

    const t = document.createElement("p");
    t.className = "detail-total";
    t.textContent = "Total: " + A.money(total(o));
    details.append(t);
    modal.classList.remove("hidden");
  }

  function cancelOrder(id) {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    const orders = getOrders();
    const o = orders.find(x => String(x.id) === String(id));
    if (!o) return;
    if ((o.status || "Pending") !== "Pending") {
      alert("Only pending orders can be cancelled.");
      return;
    }
    o.status = "Cancelled";
    A.write(A.ORDERS_KEY, orders);
    render();
  }

  $("close-modal").addEventListener("click", () => modal.classList.add("hidden"));
  modal.addEventListener("click", e => {
    if (e.target === modal) modal.classList.add("hidden");
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") modal.classList.add("hidden");
  });
  window.addEventListener("storage", e => {
    if (e.key === A.ORDERS_KEY) render();
  });

  render();
})();