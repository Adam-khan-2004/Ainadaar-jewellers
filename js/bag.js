// ========================================
// AINADAR — TEDDY BAG ICON
// Sad bear when the bag is empty, happy bear when it has items.
// Load AFTER app.js on every page.
// ========================================
(() => {
  const btn = document.querySelector("#cartButton");
  if (!btn) return;

  const BEAR = `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
<circle cx="17" cy="14" r="7.5" fill="#d9a37e"/><circle cx="47" cy="14" r="7.5" fill="#d9a37e"/>
<circle cx="17" cy="14" r="3.8" fill="#f4c9c0"/><circle cx="47" cy="14" r="3.8" fill="#f4c9c0"/>
<ellipse cx="32" cy="53" rx="15" ry="11" fill="#e0a982"/>
<circle cx="32" cy="27" r="19" fill="#e6b48f"/>
<ellipse cx="32" cy="33" rx="8.5" ry="6.5" fill="#fbe3d3"/>
<ellipse cx="32" cy="30.5" rx="2.6" ry="2" fill="#5b3a33"/>
<g class="sad">
<circle cx="24.5" cy="24.5" r="2.2" fill="#3b2723"/><circle cx="39.5" cy="24.5" r="2.2" fill="#3b2723"/>
<circle cx="25.2" cy="23.7" r=".7" fill="#fff"/><circle cx="40.2" cy="23.7" r=".7" fill="#fff"/>
<path d="M20 20.5l7-2.5M44 20.5l-7-2.5" stroke="#5b3a33" stroke-width="1.6" stroke-linecap="round" fill="none"/>
<path d="M28 37q4-3 8 0" stroke="#5b3a33" stroke-width="1.6" stroke-linecap="round" fill="none"/>
<path class="tear" d="M24.5 27.5q-2 3 0 4.2q2-1.2 0-4.2z" fill="#9ad0f5"/>
<circle cx="20.5" cy="31" r="2.8" fill="#f6a6b8" opacity=".3"/><circle cx="43.5" cy="31" r="2.8" fill="#f6a6b8" opacity=".3"/>
</g>
<g class="happy">
<path d="M21.5 25q3-4.5 6 0M36.5 25q3-4.5 6 0" stroke="#3b2723" stroke-width="1.9" stroke-linecap="round" fill="none"/>
<path d="M27.5 34.5q4.5 5 9 0" stroke="#5b3a33" stroke-width="1.7" stroke-linecap="round" fill="#f19aa8"/>
<circle cx="20.5" cy="31" r="3" fill="#f6a6b8" opacity=".75"/><circle cx="43.5" cy="31" r="3" fill="#f6a6b8" opacity=".75"/>
<path class="spark" d="M57 5l1.4 3.2 3.2 1.4-3.2 1.4L57 14.2l-1.4-3.2-3.2-1.4 3.2-1.4z" fill="#f6b6c8"/>
<path class="spark" d="M6 12l1 2.4 2.4 1-2.4 1L6 18.8l-1-2.4-2.4-1 2.4-1z" fill="#f6b6c8"/>
<circle cx="29" cy="43" r="3.4" fill="#fff" stroke="#e3c3bd" stroke-width=".8"/>
<circle cx="36.5" cy="42" r="2.8" fill="#f6a6b8"/>
</g>
<rect x="21" y="45" width="22" height="16" rx="3.5" fill="#f08fae"/>
<path d="M26.5 45q5.5-10 11 0" stroke="#c87592" stroke-width="2.2" fill="none" stroke-linecap="round"/>
<path d="M32 56.5c-3-2.2-4.6-3.6-4.6-5.4a2.4 2.4 0 0 1 4.6-.9a2.4 2.4 0 0 1 4.6.9c0 1.8-1.6 3.2-4.6 5.4z" fill="#fff"/>
<ellipse cx="19.5" cy="50" rx="4.2" ry="8" transform="rotate(-18 19.5 50)" fill="#e6b48f"/>
<ellipse cx="44.5" cy="50" rx="4.2" ry="8" transform="rotate(18 44.5 50)" fill="#e6b48f"/>
<circle cx="26.5" cy="45.5" r="3.2" fill="#e0a982"/><circle cx="37.5" cy="45.5" r="3.2" fill="#e0a982"/>
</svg>`;

  window.ainadarBear = BEAR;

  const startCount = parseInt(document.querySelector("#cartCount")?.textContent, 10) || 0;

  btn.classList.add("bear-bag");
  btn.innerHTML =
    `<span class="bear" aria-hidden="true">${BEAR}</span>` +
    `<span class="bag-label">Bag</span>` +
    `<span class="cart-count" id="cartCount">${startCount}</span>`;

  const badge = btn.querySelector("#cartCount");
  let last = startCount;

  function sync() {
    const n = parseInt(badge.textContent, 10) || 0;
    btn.classList.toggle("has-items", n > 0);
    btn.setAttribute("aria-label",
      n ? `Open shopping bag, ${n} item${n > 1 ? "s" : ""}` : "Open shopping bag, empty");
    btn.dataset.say = n
      ? `Yay! ${n} lovely thing${n > 1 ? "s" : ""} ♡`
      : "Psst… will you fill my bag?";

    if (n > last) {
      btn.classList.remove("pop");
      void btn.offsetWidth;            // restart the jump animation
      btn.classList.add("pop");
      setTimeout(() => btn.classList.remove("pop"), 1000);
    }
    last = n;
  }

  // app.js rewrites the count text whenever the bag changes
  new MutationObserver(sync).observe(badge, { childList: true, characterData: true, subtree: true });
  sync();
})();