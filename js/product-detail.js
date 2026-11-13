// ========================================
// AINADAR — INDIVIDUAL PRODUCT PAGE
// ========================================

const detailContainer = document.querySelector("#productDetail");
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

const PLACEHOLDER = "assets/images/image-placeholder.svg";

const product = typeof products !== "undefined"
  ? products.find(item => item.id === productId)
  : null;

function escapeText(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;",
    '"': "&quot;", "'": "&#39;"
  })[char]);
}

function showProduct() {
  if (!product) {
    detailContainer.innerHTML = `
      <div class="product-not-found">
        <h2>We couldn't find this little find.</h2>
        <a class="primary-button" href="index.html#product-shelves">
          Return to collection <span>↗</span>
        </a>
      </div>
    `;
    return;
  }

  document.title = `${product.name} | AINADAR`;

  detailContainer.innerHTML = `
    <div class="product-detail-grid">

      <div class="product-gallery">
        <div class="main-product-image">
          <img id="mainProductImage"
               src="${product.images[0]}"
               alt="${escapeText(product.name)}">
        </div>

        <div class="product-thumbnails">
          ${product.images.map((image, index) => `
            <button class="thumbnail-button ${index === 0 ? "active" : ""}"
                    data-image="${index}"
                    aria-label="View product photo ${index + 1}">
              <img src="${image}" alt="${escapeText(product.name)} photo ${index + 1}">
            </button>
          `).join("")}
        </div>
      </div>

      <div class="product-detail-info">

        <p class="eyebrow">AINADAR — HANDMADE</p>

        <p class="detail-category">${escapeText(product.category)}</p>

        <h1>${escapeText(product.name)}</h1>

        <p class="detail-price">
          Rs. ${Number(product.price).toLocaleString("en-PK")}
        </p>

        <p class="detail-description">
          ${escapeText(product.description)}
        </p>

        <div class="detail-block">
          <h3>Why you'll love it</h3>
          <ul>
            ${product.whyBuy.map(reason =>
              `<li>${escapeText(reason)}</li>`
            ).join("")}
          </ul>
        </div>

        <div class="detail-specifications">
          <p><strong>Material:</strong> ${escapeText(product.material)}</p>
          <p><strong>Size:</strong> ${escapeText(product.size)}</p>
          <p><strong>Care:</strong> ${escapeText(product.care)}</p>
        </div>

        <div class="detail-quantity">
          <label for="detailQuantity">Quantity</label>
          <div class="quantity-controls">
            <button id="decreaseDetail" aria-label="Decrease quantity">−</button>
            <span id="detailQuantity">1</span>
            <button id="increaseDetail" aria-label="Increase quantity">+</button>
          </div>
        </div>

        <button class="primary-button detail-add-button" id="detailAddToCart">
          Add to bag <span>♡</span>
        </button>

        <p class="handmade-detail-note">
          ✳ Handmade with care, exclusively at AINADAR.
        </p>

      </div>
    </div>
  `;

  let quantity = 1;
  const quantityDisplay = document.querySelector("#detailQuantity");

  document.querySelector("#decreaseDetail").addEventListener("click", () => {
    quantity = Math.max(1, quantity - 1);
    quantityDisplay.textContent = quantity;
  });

  document.querySelector("#increaseDetail").addEventListener("click", () => {
    quantity = Math.min(99, quantity + 1);
    quantityDisplay.textContent = quantity;
  });

  // Add to bag
  document.querySelector("#detailAddToCart").addEventListener("click", () => {
    // Uses the shared bag from app.js, so the bag opens right here
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ id: product.id, quantity });
    }

    saveCart();
    openCart();
  });

  // Thumbnails
  document.querySelectorAll(".thumbnail-button").forEach(button => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.image);

      document.querySelector("#mainProductImage").src = product.images[index];

      document.querySelectorAll(".thumbnail-button").forEach(item => {
        item.classList.remove("active");
      });

      button.classList.add("active");
    });
  });

  // Fall back to the placeholder if any image fails to load
  document.querySelectorAll(".product-gallery img").forEach(img => {
    img.addEventListener("error", () => {
      if (!img.src.endsWith("image-placeholder.svg")) img.src = PLACEHOLDER;
    });
  });
}

const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

showProduct();