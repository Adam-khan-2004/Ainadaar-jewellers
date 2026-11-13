// ========================================
// AINADAR — CHAPTER TRANSITIONS
// Load on index.html AND product.html (defer)
// ========================================
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const CHAPTERS = {
    "All": ["Prologue", "The Collection"],
    "Earrings": ["Chapter I", "Earrings"],
    "Bracelets": ["Chapter II", "Bracelets"],
    "Hand Cuffs": ["Chapter III", "Hand Cuffs"]
  };

  const stage = document.createElement("div");
  stage.className = "chapter";
  stage.setAttribute("aria-hidden", "true");
  stage.innerHTML =
    '<div class="chapter-panel"></div><div class="chapter-panel"></div>' +
    '<div class="chapter-title"><small></small><strong></strong></div>';
  document.body.appendChild(stage);

  const small = stage.querySelector("small");
  const big = stage.querySelector("strong");
  let busy = false;

  function label(a, b) {
    small.textContent = a;
    big.textContent = b;
  }

  // Close the panels, show the title, run `mid`, then open again.
  // If `mid` returns true we are leaving the page, so stay covered.
  function play(a, b, mid) {
    busy = true;
    label(a, b);
    stage.className = "chapter is-in";

    setTimeout(() => {
      if (mid && mid() === true) return;
      stage.className = "chapter is-out";
    }, 1150);

    setTimeout(() => {
      stage.className = "chapter";
      busy = false;
    }, 2000);
  }

  // ---- Arriving on a new page: start covered, then open ----
  try {
    const flag = sessionStorage.getItem("chapterIn");
    if (flag) {
      sessionStorage.removeItem("chapterIn");
      if (!reduce) {
        const [a, b] = JSON.parse(flag);
        busy = true;
        label(a, b);
        stage.className = "chapter is-in no-anim";
        setTimeout(() => {
          stage.className = "chapter is-out";
          setTimeout(() => { stage.className = "chapter"; busy = false; }, 900);
        }, 450);
      }
    }
  } catch (err) { /* storage blocked: skip the intro */ }

  // ---- Clicks ----
  document.addEventListener("click", e => {
    if (reduce || busy) return;
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;

    // Collection card -> enter that chapter, then land on the shelves
    const card = e.target.closest("[data-category]");
    if (card) {
      e.preventDefault();
      const [a, b] = CHAPTERS[card.dataset.category] || ["Chapter", card.dataset.category];
      play(a, b, () => {
        document.querySelector("#product-shelves")
          ?.scrollIntoView({ behavior: "instant", block: "start" });
      });
      return;
    }

    // Filter chips
    const chip = e.target.closest("[data-filter]");
    if (chip) {
      const [a, b] = CHAPTERS[chip.dataset.filter] || ["Chapter", chip.dataset.filter];
      play(a, b);
      return;
    }

    // Product photo -> title card, then open the product page
    const link = e.target.closest("a.product-card-image");
    if (link) {
      e.preventDefault();
      const item = link.closest(".product-card");
      const name = item?.querySelector("h3")?.textContent || "Next";
      const cat = item?.querySelector(".product-card-info p")?.textContent || "Chapter";
      play(cat, name, () => {
        try { sessionStorage.setItem("chapterIn", JSON.stringify([cat, name])); } catch (err) {}
        location.href = link.href;
        return true;
      });
    }
  });
})();