// ========================================
// AINADAR — PRODUCT CATALOGUE
// ========================================

// ---- Image settings: change here ONLY if your files differ ----
const IMG_BASE = "assets/images/product/earings/";   // your folder is still spelled "earings"
const EXT = ".jpeg ";                                  // must match the real file extension exactly

const clayImg = n => `${IMG_BASE}clay_earings/c${n}${EXT}`;
const pearlImg = n => `${IMG_BASE}pearl_earings/p${n}${EXT}`;

// ---- Shared notes ----
const SIZE_NOTE = "Handmade, so sizes vary slightly. Message us for exact measurements.";
const CARE_PEARL = "Keep away from water, perfume and chemicals. Store in a dry pouch.";
const CARE_CLAY = "Handle gently. Keep away from water, perfume and chemicals.";

const products = [

  /* ============ PEARL EARRINGS — Rs. 350 ============ */

  {
    id: "pearl-blush-charm",
    sku: "PEARL-001",
    name: "Blush Pearl Charm Earrings",
    category: "Earrings",
    price: 350,
    images: [pearlImg(1)],
    shortDescription: "Soft pearl drops with a blush-and-gold charm.",
    description: "Gentle pearl drops finished with a little blush and gold charm, made for a soft, romantic look.",
    whyBuy: [
      "Soft blush tones that suit every outfit",
      "Light and comfortable to wear all day",
      "A sweet gift for birthdays and festive days"
    ],
    material: "Pearl beads with gold-tone detailing",
    size: SIZE_NOTE,
    care: CARE_PEARL
  },

  {
    id: "pearl-pink-heart",
    sku: "PEARL-002",
    name: "Pink Heart Pearl Drops",
    category: "Earrings",
    price: 350,
    images: [pearlImg(2)],
    shortDescription: "Pink heart beads hanging from lustrous pearls.",
    description: "Sweet pink heart beads swing beneath shining pearls. A playful, girly pair that still feels elegant.",
    whyBuy: [
      "Cute heart design that stands out",
      "Pairs beautifully with pastel and white outfits",
      "Perfect for gifting to someone you love"
    ],
    material: "Pearl beads and pink heart beads",
    size: SIZE_NOTE,
    care: CARE_PEARL
  },

  {
    id: "pearl-mint-heart",
    sku: "PEARL-003",
    name: "Mint Heart Pearl Drops",
    category: "Earrings",
    price: 350,
    images: [pearlImg(3)],
    shortDescription: "Fresh mint heart beads with pearl detailing.",
    description: "Cool mint heart beads paired with pearls for a fresh, dreamy pair that brightens everyday looks.",
    whyBuy: [
      "A fresh, calming colour that feels different",
      "Lightweight drops that move gracefully",
      "Lovely with summer and casual outfits"
    ],
    material: "Pearl beads and mint heart beads",
    size: SIZE_NOTE,
    care: CARE_PEARL
  },

  {
    id: "pearl-lilac-heart",
    sku: "PEARL-004",
    name: "Lilac Heart Pearl Drops",
    category: "Earrings",
    price: 350,
    images: [pearlImg(4)],
    shortDescription: "Dreamy lilac hearts with delicate pearls.",
    description: "Soft lilac heart beads hang from delicate pearls, a pretty pair with a dreamy pastel feel.",
    whyBuy: [
      "Gentle lilac shade that matches many colours",
      "Delicate and easy to wear",
      "A thoughtful handmade gift"
    ],
    material: "Pearl beads and lilac heart beads",
    size: SIZE_NOTE,
    care: CARE_PEARL
  },

  {
    id: "pearl-cowrie-hoops",
    sku: "PEARL-005",
    name: "Cowrie Shell Pearl Hoops",
    category: "Earrings",
    price: 350,
    images: [pearlImg(5)],
    shortDescription: "Beaded hoops with natural cowrie shell charms.",
    description: "Round hoops strung with creamy pearl beads and finished with cowrie shell charms. A beachy, boho piece with a handmade feel.",
    whyBuy: [
      "Bold boho style without being heavy",
      "Natural shell charm gives each pair its own character",
      "Statement hoops for dresses and kurtas alike"
    ],
    material: "Pearl beads, cowrie shell charms and handmade hoops",
    size: SIZE_NOTE,
    care: CARE_PEARL
  },

  {
    id: "pearl-emerald-drop",
    sku: "PEARL-006",
    name: "Emerald Bead Pearl Drops",
    category: "Earrings",
    price: 350,
    images: [pearlImg(6)],
    shortDescription: "Slim gold-tone drops with a deep green bead.",
    description: "Slim, graceful drops finished with a deep emerald-green bead. Simple, elegant and easy to dress up.",
    whyBuy: [
      "Minimal design with a rich pop of green",
      "Slim and light for all-day comfort",
      "Elegant for work, dinners and festive events"
    ],
    material: "Pearl beads, green bead and gold-tone detailing",
    size: SIZE_NOTE,
    care: CARE_PEARL
  },

  /* ============ CLAY EARRINGS — Rs. 380 ============ */

  {
    id: "clay-lilac-bloom",
    sku: "CLAY-001",
    name: "Lilac Bloom Clay Studs",
    category: "Earrings",
    price: 380,
    images: [clayImg(1)],
    shortDescription: "Tiny handmade clay flowers in soft lilac.",
    description: "Small clay flowers sculpted by hand in soft lilac and pink. Everyday studs that add a little bloom to your look.",
    whyBuy: [
      "Small, light and perfect for daily wear",
      "Each flower is shaped by hand",
      "A sweet, subtle floral touch"
    ],
    material: "Handmade clay",
    size: SIZE_NOTE,
    care: CARE_CLAY
  },

  {
    id: "clay-sunny-green",
    sku: "CLAY-002",
    name: "Sunny Green Clay Dangles",
    category: "Earrings",
    price: 380,
    images: [clayImg(2)],
    shortDescription: "Bright green and yellow patterned clay dangles.",
    description: "Colourful clay dangles with a bright green and yellow pattern, made to bring a cheerful pop to any outfit.",
    whyBuy: [
      "Bold pattern that makes simple outfits special",
      "Lightweight clay, easy to wear",
      "A cheerful design you won't see everywhere"
    ],
    material: "Handmade clay with gold-tone hooks",
    size: SIZE_NOTE,
    care: CARE_CLAY
  },

  {
    id: "clay-violet-blossom",
    sku: "CLAY-003",
    name: "Violet Blossom Clay Drops",
    category: "Earrings",
    price: 380,
    images: [clayImg(3)],
    shortDescription: "Violet clay flowers hanging from fine gold chains.",
    description: "Little violet clay flowers swing from fine gold chains, a graceful pair with a delicate garden feel.",
    whyBuy: [
      "Pretty purple flowers with a delicate chain",
      "Light and graceful movement",
      "Lovely with both western and traditional outfits"
    ],
    material: "Handmade clay with gold-tone chain",
    size: SIZE_NOTE,
    care: CARE_CLAY
  },

  {
    id: "clay-cherry-charm",
    sku: "CLAY-004",
    name: "Cherry Charm Clay Earrings",
    category: "Earrings",
    price: 380,
    images: [clayImg(4)],
    shortDescription: "Glossy red clay cherries on gold-tone hooks.",
    description: "Playful red clay cherries on gold-tone hooks. A fun, eye-catching pair that works as a perfect little gift.",
    whyBuy: [
      "Playful cherry design full of personality",
      "Bright red adds colour to neutral outfits",
      "A cute, memorable gift"
    ],
    material: "Handmade clay with gold-tone hooks",
    size: SIZE_NOTE,
    care: CARE_CLAY
  }
];
