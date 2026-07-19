// ─── Helper ──────────────────────────────────────────────────────────────────
function svg(body: string, w: number, h: number): string {
  const markup = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`;
  return "data:image/svg+xml," + encodeURIComponent(markup);
}

const GOLD = `<linearGradient id="gld" x1="0%" y1="0%" x2="100%" y2="100%">
  <stop offset="0%" stop-color="#F0D68A"/>
  <stop offset="50%" stop-color="#C8A96A"/>
  <stop offset="100%" stop-color="#8B6914"/>
</linearGradient>`;

const SILVER = `<linearGradient id="slv" x1="0%" y1="0%" x2="100%" y2="100%">
  <stop offset="0%" stop-color="#FFFFFF"/>
  <stop offset="50%" stop-color="#C8C8C8"/>
  <stop offset="100%" stop-color="#888888"/>
</linearGradient>`;

const ROSE = `<linearGradient id="ros" x1="0%" y1="0%" x2="100%" y2="100%">
  <stop offset="0%" stop-color="#F4C0C8"/>
  <stop offset="50%" stop-color="#C8707A"/>
  <stop offset="100%" stop-color="#8B3A44"/>
</linearGradient>`;

// ─── Types ────────────────────────────────────────────────────────────────────
export type JewelryCategory = "necklace" | "earring" | "ring" | "bracelet" | "watch" | "anklet" | "nosepin";

export interface JewelryItem {
  id:          string;
  name:        string;
  price:       string;
  category:    JewelryCategory;
  src:         string;          // SVG data URI
  description: string;
}

// ─── Necklaces ────────────────────────────────────────────────────────────────
const NECKLACES: JewelryItem[] = [
  {
    id: "n1", name: "Gold Pendant Necklace", price: "PKR 1,899",
    category: "necklace", description: "Classic round-pendant chain",
    src: svg(
      `<defs>${GOLD}</defs>
       <path d="M10,10 C60,10 90,110 150,125 C210,110 240,10 290,10"
             stroke="url(#gld)" stroke-width="3" fill="none" stroke-linecap="round"/>
       <line x1="150" y1="125" x2="150" y2="136" stroke="url(#gld)" stroke-width="2"/>
       <circle cx="150" cy="150" r="14" fill="url(#gld)" stroke="#8B6914" stroke-width="1.5"/>
       <circle cx="150" cy="150" r="8"  fill="#FAF0D8"/>
       <circle cx="150" cy="150" r="4"  fill="url(#gld)"/>`,
      300, 168),
  },
  {
    id: "n2", name: "Pearl Necklace", price: "PKR 2,299",
    category: "necklace", description: "Classic string of pearls",
    src: svg(
      `<path d="M10,10 C60,10 90,100 150,118 C210,100 240,10 290,10"
             stroke="#DDD" stroke-width="1.5" fill="none"/>
       ${[
         [10,10],[43,20],[75,45],[108,74],[135,100],
         [150,118],
         [165,100],[192,74],[225,45],[257,20],[290,10],
       ].map(([cx,cy]) =>
         `<circle cx="${cx}" cy="${cy}" r="10" fill="#F8F4F0" stroke="#E0D8D0" stroke-width="1"/>
          <circle cx="${cx-3}" cy="${cy-3}" r="4" fill="white" opacity="0.7"/>`
       ).join("")}`,
      300, 132),
  },
];

// ─── Earrings ─────────────────────────────────────────────────────────────────
const EARRINGS: JewelryItem[] = [
  {
    id: "e1", name: "Gold Teardrop Drop", price: "PKR 899",
    category: "earring", description: "Elegant gold teardrop dangles",
    src: svg(
      `<defs>${GOLD}</defs>
       <circle cx="20" cy="8" r="6" fill="url(#gld)" stroke="#8B6914" stroke-width="1"/>
       <line x1="20" y1="14" x2="20" y2="26" stroke="#C8A96A" stroke-width="1.5"/>
       <ellipse cx="20" cy="56" rx="14" ry="22" fill="url(#gld)" stroke="#8B6914" stroke-width="1"/>
       <ellipse cx="20" cy="53" rx="7" ry="11" fill="#FAF0D8" opacity="0.75"/>`,
      40, 82),
  },
  {
    id: "e2", name: "Pearl Drop Earring", price: "PKR 1,199",
    category: "earring", description: "Lustrous pearl on gold drop",
    src: svg(
      `<defs>${GOLD}</defs>
       <circle cx="20" cy="8" r="5" fill="url(#gld)" stroke="#8B6914" stroke-width="1"/>
       <line x1="20" y1="13" x2="20" y2="28" stroke="#C8A96A" stroke-width="1"/>
       <circle cx="20" cy="46" r="18" fill="#F8F4F0" stroke="#E0D8D0" stroke-width="1.5"/>
       <circle cx="14" cy="40" r="6" fill="white" opacity="0.7"/>`,
      40, 68),
  },
];

// ─── Rings ────────────────────────────────────────────────────────────────────
const RINGS: JewelryItem[] = [
  {
    id: "r1", name: "Solitaire Diamond Ring", price: "PKR 2,799",
    category: "ring", description: "Classic single-stone solitaire",
    src: svg(
      `<defs>${GOLD}</defs>
       <rect x="2" y="28" width="84" height="18" rx="9" fill="url(#gld)" stroke="#8B6914" stroke-width="1"/>
       <rect x="4" y="31" width="80" height="6" rx="3" fill="#F0D68A" opacity="0.5"/>
       <circle cx="44" cy="24" r="20" fill="url(#gld)" stroke="#8B6914" stroke-width="1.5"/>
       <polygon points="44,6 56,18 52,34 36,34 32,18" fill="white" opacity="0.95"/>`,
      88, 48),
  },
  {
    id: "r2", name: "Gold Eternity Band", price: "PKR 1,499",
    category: "ring", description: "All-around diamond eternity band",
    src: svg(
      `<defs>${GOLD}</defs>
       <rect x="2" y="14" width="84" height="20" rx="10" fill="url(#gld)" stroke="#8B6914" stroke-width="1"/>
       ${[14,26,38,50,62,74].map(cx =>
         `<circle cx="${cx}" cy="24" r="6" fill="white" opacity="0.9"/>
          <circle cx="${cx}" cy="24" r="3" fill="#E8F4FF"/>`
       ).join("")}
       <rect x="4" y="17" width="80" height="5" rx="2.5" fill="#F0D68A" opacity="0.4"/>`,
      88, 48),
  },
];

// ─── Braceletes ───────────────────────────────────────────────────────────────
const BRACELETS: JewelryItem[] = [
  {
    id: "b1", name: "Classic Gold Chain", price: "PKR 1,299",
    category: "bracelet", description: "Timeless gold link chain",
    src: svg(
      `<defs>${GOLD}</defs>
       <rect x="0" y="17" width="300" height="16" rx="8" fill="url(#gld)"/>
       ${Array.from({length:13},(_,i)=>`<ellipse cx="${14+i*22}" cy="25" rx="8" ry="5" stroke="#8B6914" stroke-width="1" fill="none"/>`).join("")}
       <rect x="1"  y="20" width="298" height="5"  rx="2.5" fill="#F0D68A" opacity="0.5"/>`,
      300, 50),
  },
  {
    id: "b2", name: "Silver Elegance Bangle", price: "PKR 999",
    category: "bracelet", description: "Sleek silver bangle",
    src: svg(
      `<defs>${SILVER}</defs>
       <rect x="0" y="14" width="300" height="22" rx="11" fill="url(#slv)" stroke="#888" stroke-width="1"/>
       <rect x="4" y="18" width="292" height="8"  rx="4"  fill="white" opacity="0.55"/>`,
      300, 50),
  },
];

// ─── Watches ──────────────────────────────────────────────────────────────────
const WATCHES: JewelryItem[] = [
  {
    id: "w1", name: "Aura Chronograph Gold", price: "PKR 4,899",
    category: "watch", description: "Grand 18K gold-plated custom watch",
    src: svg(
      `<defs>${GOLD}</defs>
       <rect x="0" y="16" width="300" height="18" rx="5" fill="url(#gld)"/>
       <circle cx="150" cy="25" r="23" fill="url(#gld)" stroke="#8B6914" stroke-width="2"/>
       <circle cx="150" cy="25" r="18" fill="#111111"/>`,
      300, 50),
  },
];

// ─── Anklets ──────────────────────────────────────────────────────────────────
const ANKLETS: JewelryItem[] = [
  {
    id: "ak1", name: "Royal Gold Bell Anklet", price: "PKR 1,299",
    category: "anklet", description: "Traditional gold chain with mini ringing charms",
    src: svg(
      `<defs>${GOLD}</defs>
       <path d="M10,25 C80,35 220,35 290,25" stroke="url(#gld)" stroke-width="2.5" fill="none"/>
       ${[40,90,140,190,240].map(cx=>
         `<circle cx="${cx}" cy="30" r="5" fill="url(#gld)"/>
          <circle cx="${cx}" cy="37" r="2.5" fill="#FAF0D8"/>`
       ).join("")}`,
      300, 50),
  },
  {
    id: "ak2", name: "Silver Lotus Anklet", price: "PKR 999",
    category: "anklet", description: "Elegant silver chain with tiny lotus blossoms",
    src: svg(
      `<defs>${SILVER}</defs>
       <path d="M10,25 C80,35 220,35 290,25" stroke="url(#slv)" stroke-width="2" fill="none"/>
       ${[60,150,230].map(cx=>
         `<polygon points="${cx},25 ${cx+5},35 ${cx},42 ${cx-5},35" fill="white" stroke="#888" stroke-width="0.8"/>`
       ).join("")}`,
      300, 50),
  },
];

// ─── Nosepins ─────────────────────────────────────────────────────────────────
const NOSEPINS: JewelryItem[] = [
  {
    id: "np1", name: "Solitaire Nose Pin", price: "PKR 799",
    category: "nosepin", description: "Dainty single diamond nose stud",
    src: svg(
      `<circle cx="15" cy="15" r="6" fill="white" stroke="#C8A96A" stroke-width="1"/>
       <circle cx="15" cy="15" r="3" fill="#E8F4FF"/>`,
      30, 30),
  },
  {
    id: "np2", name: "Classic Gold Nose Ring", price: "PKR 899",
    category: "nosepin", description: "Polished gold ring hoop for nose",
    src: svg(
      `<defs>${GOLD}</defs>
       <circle cx="15" cy="15" r="12" stroke="url(#gld)" stroke-width="3" fill="none"/>`,
      30, 30),
  },
];

// ─── All jewelry ──────────────────────────────────────────────────────────────
export const ALL_JEWELRY: JewelryItem[] = [
  ...NECKLACES,
  ...EARRINGS,
  ...RINGS,
  ...BRACELETS,
  ...WATCHES,
  ...ANKLETS,
  ...NOSEPINS,
];

export const JEWELRY_BY_CATEGORY: Record<JewelryCategory, JewelryItem[]> = {
  necklace: NECKLACES,
  earring:  EARRINGS,
  ring:     RINGS,
  bracelet: BRACELETS,
  watch:    WATCHES,
  anklet:   ANKLETS,
  nosepin:  NOSEPINS,
};

// ─── Category UI metadata ─────────────────────────────────────────────────────
export const CATEGORIES: {
  key: JewelryCategory;
  label: string;
  icon: string;
  tip: string;
  photoGuide: string;
}[] = [
  {
    key: "necklace",
    label: "Necklaces",
    icon: "📿",
    tip: "Show your neck & collarbone area",
    photoGuide: "Best: chest-up selfie with good lighting, chin slightly raised",
  },
  {
    key: "earring",
    label: "Earrings",
    icon: "💎",
    tip: "Take a front-facing portrait selfie",
    photoGuide: "Best: both ears visible, hair tucked back, facing straight at camera",
  },
  {
    key: "ring",
    label: "Rings",
    icon: "💍",
    tip: "Photo your hand from above, fingers spread",
    photoGuide: "Best: hand flat on a light surface, fingers naturally spread out",
  },
  {
    key: "bracelet",
    label: "Bracelets",
    icon: "✨",
    tip: "Show your wrist from the top",
    photoGuide: "Best: wrist resting flat, arm in natural position",
  },
  {
    key: "watch",
    label: "Watches",
    icon: "⌚",
    tip: "Show your wrist from the top",
    photoGuide: "Best: wrist resting flat, arm in natural position",
  },
  {
    key: "anklet",
    label: "Anklets",
    icon: "👣",
    tip: "Show your ankle / foot profile",
    photoGuide: "Best: photo of your ankle side-view, foot rest flat on floor",
  },
  {
    key: "nosepin",
    label: "Nose Pins",
    icon: "👃",
    tip: "Take a close-up portrait of your nose",
    photoGuide: "Best: high-res selfie facing slightly sideways, clear lighting on nose",
  },
];
