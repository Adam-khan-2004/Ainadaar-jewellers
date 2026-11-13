// ========================================
// AINADAR — PRODUCT SEARCH
// Search by name, code, category. Paste order lines too.
// Load AFTER products.js and bag.js (defer)
// ========================================
(() => {
  if (typeof products === "undefined") return;
  const cartBtn = document.querySelector("#cartButton");
  if (!cartBtn) return;

  const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[c]);
  const money = n => "Rs. " + Number(n).toLocaleString("en-PK");
  const sku = p => p.sku || p.id.toUpperCase();

  // ---- Header: search icon next to the teddy bag ----
  const actions = document.createElement("div");
  actions.className = "header-actions";
  cartBtn.before(actions);

  const openBtn = document.createElement("button");
  openBtn.type = "button";
  openBtn.className = "search-button";
  openBtn.setAttribute("aria-label", "Search products");
  openBtn.innerHTML =
    '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round">' +
    '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>';
  actions.append(openBtn, cartBtn);

  // ---- Overlay ----
  const overlay = document.createElement("div");
  overlay.className = "search-overlay";
  overlay.innerHTML = `
    <div class="search-panel" role="dialog" aria-modal="true" aria-label="Search products">
      <div class="sr-field">
        <input type="search" placeholder="Search a name, code or paste an order line…" autocomplete="off">
        <button class="sr-close" type="button" aria-label="Close search">×</button>
      </div>
      <p class="sr-hint">Tip: paste a line like “Pearl Butterfly Earrings [PEARL-001]” to find that piece.</p>
      <div class="sr-list"></div>
    </div>`;
  document.body.appendChild(overlay);

  const input = overlay.querySelector("input");
  const list = overlay.querySelector(".sr-list");

  function find(query) {
    const q = query.trim();
    if (!q) return products;

    // Codes in [BRACKETS] (from order messages) match exactly
    const codes = [...q.matchAll(/\[([^\]]+)\]/g)].map(m => m[1].trim().toLowerCase());
    if (codes.length) {
      return products.filter(p =>
        codes.includes(sku(p).toLowerCase()) || codes.includes(p.id.toLowerCase()));
    }

    // Otherwise every word must appear somewhere (numbers and "x" are ignored)
    const words = q.toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length > 1 && !/^\d+$/.test(w));
    if (!words.length) return products;

    return products.filter(p => {
      const hay = [p.name, sku(p), p.id, p.category, p.description, p.shortDescription, p.material]
        .join(" ").toLowerCase();
      return words.every(w => hay.includes(w));
    });
  }

  function render() {
    const found = find(input.value);
    list.innerHTML = found.length
      ? found.map(p => `
          <a class="sr-item" href="product.html?id=${encodeURIComponent(p.id)}">
            <img src="${p.images[0]}" alt=""
                 onerror="this.onerror=null;this.src='assets/images/image-placeholder.svg';">
            <span><b>${esc(p.name)}</b><small>${esc(sku(p))} · ${esc(p.category)}</small></span>
            <em>${money(p.price)}</em>
          </a>`).join("")
      : '<p class="sr-empty">No match yet ♡ Try “pearl”, “clay” or a product code.</p>';
  }

  const open = () => {
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
    render();
    setTimeout(() => input.focus(), 60);
  };
  const close = () => {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  };

  openBtn.addEventListener("click", open);
  overlay.querySelector(".sr-close").addEventListener("click", close);
  overlay.addEventListener("click", e => { if (e.target === overlay) close(); });
  input.addEventListener("input", render);
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") list.querySelector(".sr-item")?.click();
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && overlay.classList.contains("open")) close();
    if (e.key === "/" && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) {
      e.preventDefault();
      open();
    }
  });
})();