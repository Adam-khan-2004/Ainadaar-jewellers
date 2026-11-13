// ========================================
// AINADAR — MAGIC LAYER
// fly-to-bag, confetti, teddy moments, intro, 3D hero
// Load AFTER bag.js (defer)
// ========================================
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = s => document.querySelector(s);
  const bagBtn = () => $("#cartButton");
  const store = {
    get: k => { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set: k => { try { sessionStorage.setItem(k, "1"); } catch (e) {} }
  };

  // ---------- Confetti + hearts ----------
  const COLORS = ["#f0a9c0", "#c87592", "#f6c4d1", "#f2c9a0", "#ffffff", "#e99ab3"];

  window.ainadarConfetti = (count = 46) => {
    if (reduce) return;
    const layer = document.createElement("div");
    layer.className = "confetti";
    document.body.appendChild(layer);

    for (let i = 0; i < count; i++) {
      const heart = Math.random() < .55;
      const size = heart ? 12 + Math.random() * 18 : 6 + Math.random() * 7;
      const color = COLORS[i % COLORS.length];
      const el = document.createElement("span");
      el.className = heart ? "cf" : "cf cf-bit";
      if (heart) el.textContent = "♥";
      el.style.left = Math.random() * 100 + "vw";
      el.style.fontSize = size + "px";
      el.style.color = color;
      if (!heart) {
        el.style.width = size + "px";
        el.style.height = size * 1.5 + "px";
        el.style.background = color;
      }
      layer.appendChild(el);

      el.animate([
        { transform: "translate(0,-8vh) rotate(0deg)", opacity: 1 },
        { transform: `translate(${(Math.random() - .5) * 160}px,105vh) rotate(${(Math.random() - .5) * 720}deg)`, opacity: .9 }
      ], {
        duration: 1800 + Math.random() * 1800,
        delay: Math.random() * 500,
        easing: "cubic-bezier(.3,.1,.6,1)",
        fill: "both"
      });
    }
    setTimeout(() => layer.remove(), 4300);
  };

  // ---------- Teddy cheers / waves with a speech bubble ----------
  window.ainadarCheer = (msg, wave) => {
    const b = bagBtn();
    if (!b) return;
    b.dataset.cheer = msg || "Yay! ♡";
    b.classList.remove("pop", "wave");
    void b.offsetWidth;
    b.classList.add("cheering", wave ? "wave" : "pop");
    setTimeout(() => b.classList.remove("cheering", "pop", "wave"), wave ? 3400 : 2600);
  };

  // ---------- Fly the photo into the teddy's bag ----------
  function fly(img, done) {
    const target = $("#cartButton .bear") || bagBtn();
    if (!target) return done();
    const a = img.getBoundingClientRect();
    const b = target.getBoundingClientRect();

    const clone = document.createElement("img");
    clone.src = img.currentSrc || img.src;
    clone.className = "fly-photo";
    clone.style.cssText = `left:${a.left}px;top:${a.top}px;width:${a.width}px;height:${a.height}px`;
    document.body.appendChild(clone);

    const dx = b.left + b.width / 2 - (a.left + a.width / 2);
    const dy = b.top + b.height / 2 - (a.top + a.height / 2);

    clone.animate([
      { transform: "translate(0,0) scale(1) rotate(0deg)", opacity: 1 },
      { transform: `translate(${dx * .5}px,${dy * .5 - 80}px) scale(.45) rotate(-8deg)`, opacity: 1, offset: .55 },
      { transform: `translate(${dx}px,${dy}px) scale(.1) rotate(10deg)`, opacity: .25, borderRadius: "50%" }
    ], { duration: 760, easing: "cubic-bezier(.5,0,.3,1)", fill: "forwards" })
      .onfinish = () => { clone.remove(); done(); };
  }

  let bypass = false;
  document.addEventListener("click", e => {
    if (bypass || reduce) return;
    const button = e.target.closest("[data-add], #detailAddToCart");
    if (!button) return;

    const img = button.closest(".product-card")?.querySelector(".product-card-image img")
      || $("#mainProductImage");
    if (!img) return;

    e.stopPropagation();
    e.preventDefault();
    if (button.disabled) return;
    button.disabled = true;

    fly(img, () => {
      button.disabled = false;
      bypass = true;
      button.click();           // the normal add-to-bag runs now
      bypass = false;
    });
  }, true);

  // ---------- Teddy peeks in from the corner while scrolling ----------
  const peek = document.createElement("div");
  peek.className = "peek";
  peek.innerHTML =
    '<span class="peek-say"></span>' +
    `<button class="peek-btn" type="button" aria-label="Open shopping bag"><span class="peek-bear">${window.ainadarBear || ""}</span></button>`;
  document.body.appendChild(peek);

  const LINES = ["Psst… see something pretty?", "Handmade with love ♡", "Tap me to peek in your bag!", "Take your time, I'll wait ♡"];
  let lineIndex = 0, lastY = 0, hideTimer;

  addEventListener("scroll", () => {
    if (reduce || Math.abs(scrollY - lastY) < innerHeight * 1.5) return;
    lastY = scrollY;
    const has = !!bagBtn()?.classList.contains("has-items");
    peek.classList.toggle("has-items", has);
    peek.querySelector(".peek-say").textContent = has ? "Your bag looks lovely ♡" : LINES[lineIndex++ % LINES.length];
    peek.classList.add("show");
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => peek.classList.remove("show"), 3400);
  }, { passive: true });

  peek.querySelector(".peek-btn").addEventListener("click", () => {
    if (typeof openCart === "function") openCart();
  });

  // ---------- 3D hero follows mouse / phone tilt ----------
  const hero = $(".hero");
  const art = $(".hero-art");
  if (hero && art && !reduce) {
    let raf = 0;
    const set = (x, y) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        art.style.setProperty("--mx", x.toFixed(3));
        art.style.setProperty("--my", y.toFixed(3));
      });
    };
    hero.addEventListener("pointermove", e => {
      if (e.pointerType !== "mouse") return;
      const r = hero.getBoundingClientRect();
      set(((e.clientX - r.left) / r.width - .5) * 2, ((e.clientY - r.top) / r.height - .5) * 2);
    });
    hero.addEventListener("pointerleave", () => set(0, 0));

    // Android and other phones that allow tilt without a permission prompt
    if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission !== "function") {
      const clamp = v => Math.max(-1, Math.min(1, v));
      addEventListener("deviceorientation", e => {
        if (e.gamma == null || e.beta == null) return;
        set(clamp(e.gamma / 25), clamp((e.beta - 45) / 25));
      });
    }
  }

  // ---------- Branded intro (home page, once per visit) ----------
  let introFinished = Promise.resolve();

  if (hero && !reduce && !store.get("ainadarIntro")) {
    store.set("ainadarIntro");
    const intro = document.createElement("div");
    intro.className = "intro";
    intro.innerHTML =
      '<div class="intro-card">' +
        `<span class="intro-bear">${window.ainadarBear || ""}</span>` +
        '<img class="intro-logo" src="assets/images/ainadar-logo-from-poster.png" alt="AINADAR">' +
        '<p>Handmade with love</p>' +
        '<span class="intro-bar"><i></i></span>' +
      '</div>' +
      '<button class="intro-skip" type="button">Skip →</button>';
    document.body.appendChild(intro);

    introFinished = new Promise(resolve => {
      let ended = false;
      const end = () => {
        if (ended) return;
        ended = true;
        intro.classList.add("leave");
        setTimeout(() => { intro.remove(); resolve(); }, 700);
      };
      intro.querySelector(".intro-skip").addEventListener("click", end);
      setTimeout(end, 2300);
    });
  }
  document.documentElement.classList.remove("intro-pending");

  // ---------- The teddy waves hello (once per visit) ----------
  introFinished.then(() => {
    if (store.get("ainadarHello")) return;
    store.set("ainadarHello");
    setTimeout(() => window.ainadarCheer("Hi! Welcome to AINADAR ♡", true), 350);
  });
})();