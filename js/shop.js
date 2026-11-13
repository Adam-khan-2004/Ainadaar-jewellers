// ========================================
// AINADAR — CHECKOUT, FILTERS, 3D TILT, REVEAL
// Load AFTER products.js and app.js
// ========================================
(() => {
  const IG_USER = "ainadar.official";
  const grid = document.querySelector("#productGrid"); // null on the product page

  // KEEP IDENTICAL to orderHash in order.html (same salt text)
  function orderHash(str) {
    let h = 0x811c9dc5;
    const s = str + "|ainadar-2026";
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    return h.toString(16).padStart(8, "0");
  }

  // ---------- Category filter bar ----------
  const bar = document.createElement("div");
  bar.className = "filter-bar";
  bar.innerHTML = ["All", "Earrings", "Bracelets", "Hand Cuffs"]
    .map(c => `<button type="button" data-filter="${c}">${c}</button>`).join("");
  if (grid) grid.before(bar);

  const markFilter = () => bar.querySelectorAll("button").forEach(b =>
    b.classList.toggle("on", b.dataset.filter === selectedCategory));

  bar.addEventListener("click", e => {
    const b = e.target.closest("[data-filter]");
    if (!b) return;
    selectedCategory = b.dataset.filter;
    renderProducts();
    markFilter();
  });
  document.querySelectorAll("[data-category]").forEach(c =>
    c.addEventListener("click", () => setTimeout(markFilter)));
  markFilter();

  // ---------- Checkout modal ----------
  const modal = document.createElement("div");
  modal.className = "co-overlay";
  modal.hidden = true;
  modal.innerHTML = `
    <div class="co-card" role="dialog" aria-modal="true" aria-label="Checkout">
      <button class="co-close" type="button" aria-label="Close">×</button>

      <form id="coForm" novalidate>
        <p class="eyebrow">ALMOST YOURS</p>
        <h2>Your details</h2>
        <label>Full name
          <input name="name" autocomplete="name" required>
        </label>
        <label>Phone number
          <input name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="03XX XXXXXXX" required>
        </label>
        <label>Delivery address
          <textarea name="address" rows="3" autocomplete="street-address" required></textarea>
        </label>
        <p class="co-error" id="coError" hidden></p>
        <button class="primary-button" type="submit" style="width:100%;justify-content:space-between">
          Create order message <span>→</span>
        </button>
      </form>

      <div id="coResult" hidden>
        <p class="eyebrow">LAST STEP</p>
        <h2>Send us your order</h2>
        <p class="co-help">Copy this message and paste it in our Instagram chat. Please don't change the order link inside it. We use it to see exactly what you chose.</p>
        <textarea id="coMsg" readonly rows="11"></textarea>
        <div class="co-actions">
          <button class="primary-button" type="button" id="coCopy">Copy message <span>❐</span></button>
          <a class="primary-button" id="coIG" target="_blank" rel="noopener noreferrer"
             href="https://ig.me/m/${IG_USER}">Open Instagram chat <span>↗</span></a>
        </div>
        <button class="primary-button" type="button" id="coNew" style="width:100%;justify-content:space-between;margin-top:12px">I've sent my order <span>♡</span></button>
      </div>
      <div class="co-thanks" id="coThanks" hidden></div>
    </div>`;
  document.body.appendChild(modal);

  const form = modal.querySelector("#coForm");
  const result = modal.querySelector("#coResult");
  const msgBox = modal.querySelector("#coMsg");
  const errBox = modal.querySelector("#coError");
  const thanks = modal.querySelector("#coThanks");
  let lastName = "";

  const openModal = () => {
    form.hidden = false;
    result.hidden = true;
    thanks.hidden = true;
    errBox.hidden = true;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    form.name.focus();
  };
  const closeModal = () => {
    modal.hidden = true;
    document.body.style.overflow = "";
  };

  modal.querySelector(".co-close").addEventListener("click", closeModal);
  modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !modal.hidden) closeModal(); });

  // Replace the "Contact AINADAR" link with a real checkout button
  const oldLink = document.querySelector(".checkout-link");
  if (oldLink) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "primary-button checkout-link";
    btn.innerHTML = "Checkout <span>→</span>";
    btn.addEventListener("click", () => { closeCart(); openModal(); });
    oldLink.replaceWith(btn);
  }

  // The order message holds NO item list or prices as text.
  // Items live only in the verified order link.
  function buildMessage(d) {
    const now = new Date();
    const orderId = "AD-" +
      String(now.getDate()).padStart(2, "0") +
      String(now.getMonth() + 1).padStart(2, "0") + "-" +
      Math.floor(1000 + Math.random() * 9000);

    const valid = cart.filter(it => products.some(p => p.id === it.id));
    const items = valid.map(it => `${it.id}:${it.quantity}`).join(",");
    const code = btoa(items).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

    const link = new URL("order.html", location.href);
    link.search = new URLSearchParams({
      o: orderId,
      d: code,
      c: orderHash(orderId + "|" + items)
    }).toString();

    return [
      "AINADAR ORDER",
      `Order ID: ${orderId}`,
      "",
      `Name: ${d.name}`,
      `Phone: ${d.phone}`,
      `Address: ${d.address}`,
      "",
      "Items (quick list):",
      ...valid.map((it, i) => {
        const p = products.find(x => x.id === it.id);
        return `${i + 1}. ${p.name} [${p.sku || p.id.toUpperCase()}] x ${it.quantity}`;
      }),
      "",
      "OFFICIAL ORDER (open this link):",
      link.href
    ].join("\n");
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    const d = {
      name: form.name.value.trim(),
      phone: form.phone.value.trim(),
      address: form.address.value.trim()
    };
    const digits = d.phone.replace(/\D/g, "");

    if (!d.name || !d.address || digits.length < 10) {
      errBox.textContent = "Please add your name, a phone number with at least 10 digits, and your full address.";
      errBox.hidden = false;
      return;
    }
    if (!cart.length) { closeModal(); return; }

    msgBox.value = buildMessage(d);
    lastName = d.name;
    form.hidden = true;
    result.hidden = false;
  });

  modal.querySelector("#coCopy").addEventListener("click", async e => {
    const btn = e.currentTarget;
    try {
      await navigator.clipboard.writeText(msgBox.value);
    } catch {
      msgBox.select();
      document.execCommand("copy");
    }
    btn.innerHTML = "Copied ✓";
    window.ainadarConfetti?.();
    window.ainadarCheer?.("Copied! Now send it to us ♡");
    setTimeout(() => { btn.innerHTML = "Copy message <span>❐</span>"; }, 2200);
  });

  // "I've sent my order" -> clear the bag and show the thank-you card
  modal.querySelector("#coNew").addEventListener("click", () => {
    cart = [];
    saveCart();
    form.reset();
    const first = lastName.trim().split(" ")[0];
    thanks.innerHTML = `
      <div class="thanks-bear">${window.ainadarBear || ""}</div>
      <span class="thanks-heart">♡</span>
      <p class="eyebrow" style="margin-bottom:6px">WITH ALL OUR LOVE</p>
      <h2>Thank you${first ? ", " + escapeHTML(first) : ""}!</h2>
      <p>Your order means the world to us. Every AINADAR piece is made by hand with patience and care, and by choosing us you are supporting a small handmade dream. We're so grateful you are part of our little world.</p>
      <p>We'll reply in our Instagram chat to confirm your delivery and payment.</p>
      <div class="thanks-handle">
        <small>NEED HELP OR WANT TO CHECK YOUR ORDER?</small>
        <a href="https://ig.me/m/${IG_USER}" target="_blank" rel="noopener noreferrer">@${IG_USER} ↗</a>
      </div>
      <button class="primary-button" type="button" data-close style="width:100%;justify-content:space-between;margin-top:14px">Back to the shop <span>♡</span></button>`;
    result.hidden = true;
    thanks.hidden = false;
    thanks.querySelector("[data-close]").addEventListener("click", closeModal);
    window.ainadarConfetti?.(80);
    window.ainadarCheer?.("Thank you! ♡");
  });

  // Opened from the product page after "Add to bag"
  if (new URLSearchParams(location.search).get("cart") === "open") {
    openCart();
    history.replaceState(null, "", location.pathname);
  }

  // ---------- 3D tilt (mouse only) ----------
  const tiltTarget = ".product-card, .category-card";
  document.addEventListener("pointermove", e => {
    if (e.pointerType !== "mouse") return;
    const c = e.target.closest(tiltTarget);
    if (!c) return;
    const r = c.getBoundingClientRect();
    c.style.setProperty("--ry", ((e.clientX - r.left) / r.width - .5) * 12 + "deg");
    c.style.setProperty("--rx", ((e.clientY - r.top) / r.height - .5) * -12 + "deg");
  });
  document.addEventListener("pointerout", e => {
    const c = e.target.closest?.(tiltTarget);
    if (c && !c.contains(e.relatedTarget)) {
      c.style.setProperty("--rx", "0deg");
      c.style.setProperty("--ry", "0deg");
    }
  });

  // ---------- Scroll reveal ----------
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    }), { threshold: .12 });

    const watch = () => document.querySelectorAll(
      ".section-heading,.category-card,.product-card,.story-art,.story-copy,.handmade-section>*"
    ).forEach(el => {
      if (el.dataset.rv) return;
      el.dataset.rv = "1";
      el.classList.add("reveal");
      io.observe(el);
    });

    watch();
    if (grid) new MutationObserver(watch).observe(grid, { childList: true });
  }
})();