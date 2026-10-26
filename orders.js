
const ordersList = document.getElementById("ordersList");
const ordersMessage = document.getElementById("ordersMessage");
const detailsModal = document.getElementById("detailsModal");
const orderDetails = document.getElementById("orderDetails");
const closeModal = document.getElementById("closeModal");

const ORDER_KEY = "savoraOrders";

// Read orders from localStorage
function getOrders() {
    try {
        const orders = JSON.parse(localStorage.getItem(ORDER_KEY)) || [];
        return Array.isArray(orders) ? orders : [];
    } catch (error) {
        return [];
    }
}

// Save orders to localStorage
function saveOrders(orders) {
    localStorage.setItem(ORDER_KEY, JSON.stringify(orders));
}

// Format the price
function formatPrice(price) {
    return Number(price || 0).toFixed(2) + " EGP";
}

// Format the order date
function formatDate(dateValue) {
    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "Date unavailable";
    }

    return date.toLocaleString();
}

// Get order items
function getOrderItems(order) {
    return Array.isArray(order.items) ? order.items : [];
}

// Get item information
function getItemName(item) {
    return item.name || item.title || "Food item";
}

function getItemQuantity(item) {
    return Number(item.quantity || item.qty || 1);
}

function getItemPrice(item) {
    return Number(item.price || 0);
}

// Calculate total
function calculateTotal(order) {
    if (order.total !== undefined && order.total !== null) {
        return Number(order.total) || 0;
    }

    return getOrderItems(order).reduce(function (sum, item) {
        return sum + getItemPrice(item) * getItemQuantity(item);
    }, 0);
}

// Display empty orders message
function showEmptyMessage() {
    ordersMessage.classList.remove("hidden");
    ordersMessage.replaceChildren();

    const message = document.createElement("p");
    message.textContent = "You have no orders yet.";

    const link = document.createElement("a");
    link.href = "restaurants.html";
    link.textContent = " Explore restaurants and order your favorite food.";

    ordersMessage.append(message, link);
}

// Display all orders
function renderOrders() {
    const orders = getOrders();

    ordersList.replaceChildren();
    ordersMessage.classList.add("hidden");

    if (orders.length === 0) {
        showEmptyMessage();
        return;
    }

    orders.sort(function (a, b) {
        return new Date(b.date || 0) - new Date(a.date || 0);
    });

    orders.forEach(function (order) {
        const card = document.createElement("article");
        card.className = "order-card";

        const top = document.createElement("div");
        top.className = "order-top";

        const info = document.createElement("div");

        const id = document.createElement("p");
        id.className = "order-id";
        id.textContent = "Order #" + (order.id || "N/A");

        const date = document.createElement("p");
        date.className = "order-date";
        date.textContent = formatDate(order.date);

        info.append(id, date);

        const status = document.createElement("span");
        status.className = "status";
        status.textContent = order.status || "Pending";

        const statusClass = (order.status || "Pending")
            .toLowerCase()
            .replace(/ /g, "-");

        status.classList.add(statusClass);

        top.append(info, status);

        const itemsContainer = document.createElement("div");
        itemsContainer.className = "order-items";

        getOrderItems(order).forEach(function (item) {
            const itemLine = document.createElement("p");

            itemLine.textContent =
                getItemName(item) + " × " + getItemQuantity(item);

            itemsContainer.appendChild(itemLine);
        });

        const bottom = document.createElement("div");
        bottom.className = "order-bottom";

        const totalContainer = document.createElement("div");

        const totalLabel = document.createElement("span");
        totalLabel.className = "total-label";
        totalLabel.textContent = "Order Total";

        const total = document.createElement("span");
        total.className = "total-price";
        total.textContent = formatPrice(calculateTotal(order));

        totalContainer.append(totalLabel, total);

        const actions = document.createElement("div");
        actions.className = "order-actions";

        const detailsButton = document.createElement("button");
        detailsButton.className = "button button-secondary";
        detailsButton.textContent = "View Details";

        detailsButton.addEventListener("click", function () {
            showOrderDetails(order.id);
        });

        actions.appendChild(detailsButton);

        if ((order.status || "Pending") === "Pending") {
            const cancelButton = document.createElement("button");

            cancelButton.className = "button button-danger";
            cancelButton.textContent = "Cancel Order";

            cancelButton.addEventListener("click", function () {
                cancelOrder(order.id);
            });

            actions.appendChild(cancelButton);
        }

        bottom.append(totalContainer, actions);
        card.append(top, itemsContainer, bottom);

        ordersList.appendChild(card);
    });
}

// Add a row to order details
function addDetailRow(label, value) {
    const row = document.createElement("div");
    row.className = "detail-row";

    const labelElement = document.createElement("span");
    labelElement.textContent = label;

    const valueElement = document.createElement("strong");
    valueElement.textContent = value;

    row.append(labelElement, valueElement);
    orderDetails.appendChild(row);
}

// Show details of a selected order
function showOrderDetails(orderId) {
    const orders = getOrders();

    const order = orders.find(function (item) {
        return String(item.id) === String(orderId);
    });

    if (!order) {
        return;
    }

    orderDetails.replaceChildren();

    addDetailRow("Order ID", "#" + (order.id || "N/A"));
    addDetailRow("Date", formatDate(order.date));
    addDetailRow("Status", order.status || "Pending");
    addDetailRow(
        "Delivery Address",
        order.address || "No address provided"
    );

    const heading = document.createElement("h3");
    heading.textContent = "Ordered Items";
    heading.style.marginTop = "22px";

    orderDetails.appendChild(heading);

    const itemsContainer = document.createElement("div");
    itemsContainer.className = "detail-items";

    getOrderItems(order).forEach(function (item) {
        const row = document.createElement("div");
        row.className = "detail-item";

        const description = document.createElement("span");

        description.textContent =
            getItemName(item) + " × " +
            getItemQuantity(item) + " (" +
            formatPrice(getItemPrice(item)) + " each)";

        const subtotal = document.createElement("strong");

        subtotal.textContent = formatPrice(
            getItemPrice(item) * getItemQuantity(item)
        );

        row.append(description, subtotal);
        itemsContainer.appendChild(row);
    });

    orderDetails.appendChild(itemsContainer);

    const total = document.createElement("p");
    total.className = "detail-total";
    total.textContent = "Total: " + formatPrice(calculateTotal(order));

    orderDetails.appendChild(total);

    detailsModal.classList.remove("hidden");
}

// Cancel a pending order
function cancelOrder(orderId) {
    const confirmed = confirm(
        "Are you sure you want to cancel this order?"
    );

    if (!confirmed) {
        return;
    }

    const orders = getOrders();

    const order = orders.find(function (item) {
        return String(item.id) === String(orderId);
    });

    if (!order) {
        return;
    }

    if ((order.status || "Pending") !== "Pending") {
        alert("Only pending orders can be cancelled.");
        return;
    }

    order.status = "Cancelled";

    saveOrders(orders);
    renderOrders();
}

// Close the details popup
closeModal.addEventListener("click", function () {
    detailsModal.classList.add("hidden");
});

detailsModal.addEventListener("click", function (event) {
    if (event.target === detailsModal) {
        detailsModal.classList.add("hidden");
    }
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        detailsModal.classList.add("hidden");
    }
});

// Update orders if another page changes localStorage
window.addEventListener("storage", function (event) {
    if (event.key === ORDER_KEY) {
        renderOrders();
    }
});

// Run the page
renderOrders();
