
// ========================================
// AINADAR — MAIN WEBSITE JAVASCRIPT
// ========================================
let selectedCategory = "All";
document.querySelectorAll("[data-category]").forEach(card => {
  card.addEventListener("click", () => {
    selectedCategory = card.dataset.category;
    renderProducts();
  });
});
const money = (amount) =>
  "Rs. " + Number(amount).toLocaleString("en-PK");

const productGrid = document.querySelector("#productGrid");
const cartButton = document.querySelector("#cartButton");
const cartOverlay = document.querySelector("#cartOverlay");
const menuButton = document.querySelector("#menuButton");
const mainNav = document.querySelector("#mainNav");

let cart = [];

try {
  cart = JSON.parse(localStorage.getItem("ainadarCart")) || [];
  if (!Array.isArray(cart)) cart = [];
} catch {
  cart = [];
}

// ----------------------------------------
// PRODUCT CARDS
// ----------------------------------------

function renderProducts() {
  if (!productGrid) return;

  const filteredProducts = selectedCategory === "All"
    ? products
    : products.filter(product =>
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      );

  productGrid.innerHTML = filteredProducts.map(product => `
    <article class="product-card">
      <a class="product-card-image"
         href="product.html?id=${encodeURIComponent(product.id)}">

        <img
          src="${product.images[0]}"
          alt="${escapeHTML(product.name)}"
          loading="lazy"
          onerror="this.onerror=null;this.src='assets/images/image-placeholder.svg';">

        <span class="product-view-label">VIEW DETAILS ↗</span>
      </a>

      <div class="product-card-info">
        <div>
          <h3>${escapeHTML(product.name)}</h3>
          <p>${escapeHTML(product.category)}</p>
        </div>

        <strong>${money(product.price)}</strong>
      </div>

      <button class="add-to-cart-button"
              data-add="${escapeHTML(product.id)}">
        ADD TO BAG +
      </button>
    </article>
  `).join("");
}

// Escape product text before inserting it into HTML.
function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

// ----------------------------------------
// CART STORAGE
// ----------------------------------------

function saveCart() {
  localStorage.setItem("ainadarCart", JSON.stringify(cart));
  renderCart();
}

function addToCart(productId) {
  const product = products.find(item => item.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: productId,
      quantity: 1
    });
  }

  saveCart();
  openCart();
}

// ----------------------------------------
// CART DISPLAY
// ----------------------------------------

function renderCart() {
  const cartItems = document.querySelector("#cartItems");
  const emptyCart = document.querySelector("#emptyCart");
  const cartSummary = document.querySelector("#cartSummary");
  const cartCount = document.querySelector("#cartCount");
  const drawerCount = document.querySelector("#drawerCount");
  const cartTotal = document.querySelector("#cartTotal");

  if (!cartItems) return;

  let totalQuantity = 0;
  let totalPrice = 0;

  cart = cart.filter(item =>
    products.some(product => product.id === item.id)
  );

  cartItems.innerHTML = cart.map(item => {
    const product = products.find(p => p.id === item.id);
    if (!product) return "";

    totalQuantity += item.quantity;
    totalPrice += product.price * item.quantity;

    return `
      <article class="cart-item">
        <img src="${product.images[0]}"
             alt="${escapeHTML(product.name)}"
             onerror="this.onerror=null;this.src='assets/images/image-placeholder.svg';">

        <div class="cart-item-details">
          <h3>${escapeHTML(product.name)}</h3>
          <p>${money(product.price)}</p>

          <div class="quantity-controls">
            <button data-quantity="${product.id}" data-change="-1"
                    aria-label="Decrease quantity">−</button>
            <span>${item.quantity}</span>
            <button data-quantity="${product.id}" data-change="1"
                    aria-label="Increase quantity">+</button>
          </div>

          <button class="remove-item"
                  data-remove="${product.id}">
            Remove
          </button>
        </div>

        <strong>${money(product.price * item.quantity)}</strong>
      </article>
    `;
  }).join("");

  if (cartCount) cartCount.textContent = totalQuantity;
  if (drawerCount) drawerCount.textContent = `(${totalQuantity})`;
  if (cartTotal) cartTotal.textContent = money(totalPrice);

  if (emptyCart) emptyCart.hidden = totalQuantity > 0;
  if (cartSummary) cartSummary.hidden = totalQuantity === 0;
}

// ----------------------------------------
// CART ACTIONS
// ----------------------------------------

function openCart() {
  cartOverlay?.classList.add("is-open");
  cartOverlay?.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  cartOverlay?.classList.remove("is-open");
  cartOverlay?.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

productGrid?.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(button.dataset.add);
});

document.querySelector("#cartItems")?.addEventListener("click", event => {
  const quantityButton = event.target.closest("[data-quantity]");
  const removeButton = event.target.closest("[data-remove]");

  if (quantityButton) {
    const item = cart.find(p => p.id === quantityButton.dataset.quantity);
    if (!item) return;

    item.quantity += Number(quantityButton.dataset.change);

    if (item.quantity <= 0) {
      cart = cart.filter(p => p.id !== item.id);
    }

    saveCart();
  }

  if (removeButton) {
    cart = cart.filter(p => p.id !== removeButton.dataset.remove);
    saveCart();
  }
});

cartButton?.addEventListener("click", openCart);
document.querySelector("#closeCart")?.addEventListener("click", closeCart);
document.querySelector("#closeCartBackdrop")?.addEventListener("click", closeCart);

document.querySelector("#continueShopping")?.addEventListener("click", () => {
  closeCart();
  document.querySelector("#collections")?.scrollIntoView({
    behavior: "smooth"
  });
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeCart();
});

// ----------------------------------------
// MOBILE MENU
// ----------------------------------------

menuButton?.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

mainNav?.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("is-open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

// ----------------------------------------
// FOOTER AND STARTUP
// ----------------------------------------

const yearElement = document.querySelector("#year");
if (yearElement) yearElement.textContent = new Date().getFullYear();

renderProducts();
renderCart();

