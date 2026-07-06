// EasyMom Foods — product catalog, categories, recipes & brand content.
// In a production deployment this would be sourced from the database; here it
// is a typed, hand-curated catalog that powers the storefront experience.

export type SpiceLevel = "Mild" | "Medium" | "Hot" | "Fiery";

export type Category = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  count: number;
  accent: string; // tailwind color token name
  hue: number; // base hue for the card visual
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  price: number; // in INR
  mrp: number;
  weight: string;
  rating: number;
  reviewCount: number;
  badge?: string;
  bestSeller?: boolean;
  isNew?: boolean;
  shortDesc: string;
  description: string;
  ingredients: string[];
  origin: string;
  shelfLife: string;
  spiceLevel: SpiceLevel;
  cookingTime: string;
  servings: string;
  tags: string[];
  hue: number; // 0-360 base hue for card visual
};

export type Recipe = {
  id: string;
  title: string;
  region: string;
  time: string;
  serves: string;
  difficulty: "Easy" | "Medium" | "Involved";
  productSlug: string;
  excerpt: string;
  steps: string[];
  hue: number;
};

export type Testimonial = {
  id: string;
  name: string;
  location: string;
  role: string;
  quote: string;
  rating: number;
  product: string;
};

export const categories: Category[] = [
  {
    id: "chicken",
    name: "Chicken Masalas",
    tagline: "Slow-cooked character, fast",
    description:
      "Region-defining chicken masalas from Mangalore, Chettinad and Kerala — ground fresh, blended in small batches.",
    count: 6,
    accent: "chilli",
    hue: 27,
  },
  {
    id: "veg",
    name: "Vegetarian Classics",
    tagline: "Everyday South, sorted",
    description:
      "Sambar, rasam, bisi bele bath — the backbone of a South Indian kitchen, perfected for the modern stove.",
    count: 5,
    accent: "leaf",
    hue: 145,
  },
  {
    id: "seafood",
    name: "Seafood Blends",
    tagline: "Coastal heritage, bottled",
    description:
      "Mangalorean fish curry and Goan vindaloo blends built on roasted coastal spices and hand-pounded coconut.",
    count: 3,
    accent: "turmeric",
    hue: 80,
  },
  {
    id: "ready",
    name: "Ready-to-Cook",
    tagline: "From pouch to plate in 15",
    description:
      "Full meal kits with pre-measured masala, rice and base — just add water and a pan. Built for busy evenings.",
    count: 4,
    accent: "chilli",
    hue: 40,
  },
  {
    id: "breakfast",
    name: "Breakfast Essentials",
    tagline: "The first bite, done right",
    description:
      "Chutney powders, podis and idli companions that turn a rushed morning into a proper South Indian breakfast.",
    count: 4,
    accent: "turmeric",
    hue: 60,
  },
  {
    id: "pickles",
    name: "Pickles & Chutneys",
    tagline: "Sun-cured, slow-aged",
    description:
      "Traditional lime, mango and tomato pickles cured in cold-pressed sesame oil — bold, bright, made to last.",
    count: 3,
    accent: "leaf",
    hue: 100,
  },
];

export const products: Product[] = [
  {
    id: "p1",
    name: "Mangalorean Chicken Masala",
    slug: "mangalorean-chicken-masala",
    categoryId: "chicken",
    price: 245,
    mrp: 290,
    weight: "100 g",
    rating: 4.9,
    reviewCount: 412,
    badge: "Signature",
    bestSeller: true,
    shortDesc: "Roasted coastal spices for a deep, coconut-rich curry.",
    description:
      "Our flagship blend. Whole red chillies, coriander and roasted coconut are slow-ground with Mangalore's signature warmth — built for a chicken curry that tastes like it simmered all afternoon, in under 30 minutes.",
    ingredients: ["Byadgi red chilli", "Roasted coconut", "Coriander", "Cumin", "Black pepper", "Curry leaves", "Turmeric"],
    origin: "Mangalore, Karnataka",
    shelfLife: "9 months",
    spiceLevel: "Hot",
    cookingTime: "25 min",
    servings: "Serves 4",
    tags: ["bestseller", "coconut", "coastal"],
    hue: 27,
  },
  {
    id: "p2",
    name: "Chettinad Chicken Masala",
    slug: "chettinad-chicken-masala",
    categoryId: "chicken",
    price: 265,
    mrp: 300,
    weight: "100 g",
    rating: 4.8,
    reviewCount: 286,
    bestSeller: true,
    shortDesc: "Pepper-forward, smoky, unmistakably Chettinad.",
    description:
      "A bold, peppery blend from the Chettinad heartland — star anise, fennel and black pepper lead, with a smoky backdrop from dry-roasted lentils. Made for those who like their chicken with intent.",
    ingredients: ["Black pepper", "Star anise", "Fennel", "Dry red chilli", "Toor dal", "Bengal gram", "Cinnamon"],
    origin: "Karaikudi, Tamil Nadu",
    shelfLife: "9 months",
    spiceLevel: "Fiery",
    cookingTime: "30 min",
    servings: "Serves 4",
    tags: ["peppery", "bold"],
    hue: 18,
  },
  {
    id: "p3",
    name: "Kerala Garam Masala",
    slug: "kerala-garam-masala",
    categoryId: "chicken",
    price: 220,
    mrp: 250,
    weight: "100 g",
    rating: 4.7,
    reviewCount: 198,
    shortDesc: "Warm, fragrant — the finisher for everything.",
    description:
      "A Kerala-style garam masala built on cardamom, cloves and cassia, hand-ground to keep the volatile oils intact. A pinch at the end lifts any curry, biryani or roast.",
    ingredients: ["Cardamom", "Cloves", "Cassia bark", "Black cardamom", "Nutmeg", "Mace", "Fennel"],
    origin: "Kochi, Kerala",
    shelfLife: "10 months",
    spiceLevel: "Mild",
    cookingTime: "Finishing spice",
    servings: "50+ dishes",
    tags: ["fragrant", "finishing"],
    hue: 50,
  },
  {
    id: "p4",
    name: "Pepper Chicken Masala",
    slug: "pepper-chicken-masala",
    categoryId: "chicken",
    price: 240,
    mrp: 275,
    weight: "100 g",
    rating: 4.8,
    reviewCount: 173,
    isNew: true,
    shortDesc: "Dry-roast pepper chicken, no gravy needed.",
    description:
      "A dry-roast blend for the classic Kerala pepper chicken — cracked black pepper, curry leaves and coconut oil do the heavy lifting. Seven minutes in a hot pan and dinner is decided.",
    ingredients: ["Tellicherry pepper", "Curry leaves", "Coconut", "Mustard", "Fennel", "Turmeric"],
    origin: "Kottayam, Kerala",
    shelfLife: "9 months",
    spiceLevel: "Hot",
    cookingTime: "20 min",
    servings: "Serves 3",
    tags: ["dry-roast", "new"],
    hue: 32,
  },
  {
    id: "p5",
    name: "Egg Roast Masala",
    slug: "egg-roast-masala",
    categoryId: "chicken",
    price: 195,
    mrp: 220,
    weight: "80 g",
    rating: 4.6,
    reviewCount: 142,
    shortDesc: "Street-style Kerala egg roast, done in 15.",
    description:
      "The bold, sticky egg roast you find in thattu kadas across Kerala — tomato, onion and a roar of spice clinging to halved eggs. A 15-minute weeknight rescue.",
    ingredients: ["Red chilli", "Coriander", "Fenugreek", "Mustard", "Curry leaves", "Tomato powder"],
    origin: "Thrissur, Kerala",
    shelfLife: "9 months",
    spiceLevel: "Hot",
    cookingTime: "15 min",
    servings: "Serves 3",
    tags: ["quick", "eggs"],
    hue: 22,
  },
  {
    id: "p6",
    name: "Kerala Chicken Stew Masala",
    slug: "kerala-chicken-stew-masala",
    categoryId: "chicken",
    price: 230,
    mrp: 260,
    weight: "90 g",
    rating: 4.5,
    reviewCount: 96,
    shortDesc: "Mild coconut-milk stew, appam's best friend.",
    description:
      "A gentle, fragrant blend for the beloved Kerala chicken stew — built on white pepper, green cardamom and a whisper of turmeric. The counterpart to a crisp appam.",
    ingredients: ["White pepper", "Green cardamom", "Cloves", "Ginger", "Turmeric", "Mace"],
    origin: "Alappuzha, Kerala",
    shelfLife: "10 months",
    spiceLevel: "Mild",
    cookingTime: "30 min",
    servings: "Serves 4",
    tags: ["mild", "coconut-milk"],
    hue: 55,
  },
  {
    id: "p7",
    name: "Sambar Powder",
    slug: "sambar-powder",
    categoryId: "veg",
    price: 185,
    mrp: 210,
    weight: "200 g",
    rating: 4.9,
    reviewCount: 524,
    badge: "Bestseller",
    bestSeller: true,
    shortDesc: "The everyday sambar, finally right.",
    description:
      "A balanced sambar powder — toor dal and roasted coriander as the base, asafoetida for depth, byadgi chilli for colour without assault. Tastes like amma's, because it's built the same way.",
    ingredients: ["Toor dal", "Coriander", "Byadgi chilli", "Asafoetida", "Curry leaves", "Mustard", "Turmeric"],
    origin: "Tirunelveli, Tamil Nadu",
    shelfLife: "10 months",
    spiceLevel: "Medium",
    cookingTime: "20 min",
    servings: "Serves 6",
    tags: ["bestseller", "everyday"],
    hue: 38,
  },
  {
    id: "p8",
    name: "Rasam Powder",
    slug: "rasam-powder",
    categoryId: "veg",
    price: 175,
    mrp: 200,
    weight: "200 g",
    rating: 4.8,
    reviewCount: 311,
    bestSeller: true,
    shortDesc: "Peppery, tangy, soul-warming.",
    description:
      "A rasam powder that respects the pepper — toor dal for body, black pepper and cumin for the heat-aroma duet. Steep, sip, reset.",
    ingredients: ["Toor dal", "Black pepper", "Cumin", "Coriander", "Curry leaves", "Asafoetida"],
    origin: "Madurai, Tamil Nadu",
    shelfLife: "10 months",
    spiceLevel: "Medium",
    cookingTime: "12 min",
    servings: "Serves 4",
    tags: ["everyday", "peppery"],
    hue: 45,
  },
  {
    id: "p9",
    name: "Bisi Bele Bath Masala",
    slug: "bisi-bele-bath-masala",
    categoryId: "veg",
    price: 210,
    mrp: 240,
    weight: "150 g",
    rating: 4.8,
    reviewCount: 207,
    shortDesc: "Karnataka's one-pot comfort, done properly.",
    description:
      "The complete bisi bele bath blend — rice, lentils and a fragrant spice base in one ratio. Twenty minutes, one pot, a Karnataka classic on the table.",
    ingredients: ["Chana dal", "Urad dal", "Coriander", "Byadgi chilli", "Cinnamon", "Cloves", "Curry leaves"],
    origin: "Bengaluru, Karnataka",
    shelfLife: "10 months",
    spiceLevel: "Medium",
    cookingTime: "25 min",
    servings: "Serves 4",
    tags: ["one-pot"],
    hue: 42,
  },
  {
    id: "p10",
    name: "Coconut Chutney Mix",
    slug: "coconut-chutney-mix",
    categoryId: "breakfast",
    price: 165,
    mrp: 190,
    weight: "150 g",
    rating: 4.7,
    reviewCount: 188,
    shortDesc: "Idli's other half, in 90 seconds.",
    description:
      "A dry coconut chutney base — just add warm water and a tempering of mustard and curry leaves. The freshest chutney you'll make on a Tuesday morning.",
    ingredients: ["Desiccated coconut", "Roasted chana", "Green chilli", "Ginger", "Curry leaves", "Asafoetida"],
    origin: "Kochi, Kerala",
    shelfLife: "8 months",
    spiceLevel: "Medium",
    cookingTime: "2 min",
    servings: "Serves 4",
    tags: ["breakfast", "quick"],
    hue: 65,
  },
  {
    id: "p11",
    name: "Gunpowder (Idli Podi)",
    slug: "gunpowder-idli-podi",
    categoryId: "breakfast",
    price: 195,
    mrp: 220,
    weight: "200 g",
    rating: 4.9,
    reviewCount: 364,
    badge: "Cult favourite",
    bestSeller: true,
    shortDesc: "The podi that started it all.",
    description:
      "Our most-ordered podi — roasted lentils, sesame and a heavy hand of black pepper, ground to a coarse, oily crunch. Mixed with hot rice and sesame oil, it's a meal in itself.",
    ingredients: ["Toor dal", "Chana dal", "White sesame", "Black pepper", "Dry red chilli", "Asafoetida", "Curry leaves"],
    origin: "Kumbakonam, Tamil Nadu",
    shelfLife: "10 months",
    spiceLevel: "Hot",
    cookingTime: "Ready to eat",
    servings: "12 servings",
    tags: ["bestseller", "podi"],
    hue: 35,
  },
  {
    id: "p12",
    name: "Curry Leaf Podi",
    slug: "curry-leaf-podi",
    categoryId: "breakfast",
    price: 205,
    mrp: 230,
    weight: "180 g",
    rating: 4.7,
    reviewCount: 121,
    isNew: true,
    shortDesc: "Fresh curry leaves, sun-dried and ground.",
    description:
      "Aromatic curry leaves sun-dried and ground with roasted lentils and red chilli — an iron-rich, deeply South Indian podi for rice, dosa or just-rice-and-oil evenings.",
    ingredients: ["Curry leaves", "Toor dal", "Chana dal", "Red chilli", "Black pepper", "Tamarind"],
    origin: "Thanjavur, Tamil Nadu",
    shelfLife: "9 months",
    spiceLevel: "Medium",
    cookingTime: "Ready to eat",
    servings: "10 servings",
    tags: ["podi", "new"],
    hue: 110,
  },
  {
    id: "p13",
    name: "Mangalorean Fish Curry Masala",
    slug: "mangalorean-fish-curry-masala",
    categoryId: "seafood",
    price: 255,
    mrp: 290,
    weight: "100 g",
    rating: 4.8,
    reviewCount: 178,
    badge: "Signature",
    shortDesc: "Tangy, red, coconut-thick — the coast in a bowl.",
    description:
      "The masala behind a proper Mangalorean fish curry — byadgi chilli for the red, roasted spices for body, and a tang that comes from tamarind, not vinegar. Built for firm white fish.",
    ingredients: ["Byadgi chilli", "Coriander", "Fenugreek", "Cumin", "Tamarind", "Mustard", "Curry leaves"],
    origin: "Mangalore, Karnataka",
    shelfLife: "9 months",
    spiceLevel: "Hot",
    cookingTime: "30 min",
    servings: "Serves 4",
    tags: ["coastal", "tangy"],
    hue: 25,
  },
  {
    id: "p14",
    name: "Goan Vindaloo Masala",
    slug: "goan-vindaloo-masala",
    categoryId: "seafood",
    price: 260,
    mrp: 295,
    weight: "100 g",
    rating: 4.7,
    reviewCount: 134,
    shortDesc: "Vinegar-bright, garlic-heavy, unmistakably Goan.",
    description:
      "A vindaloo base in the Goan Catholic tradition — Kashmiri chilli, garlic, ginger and a vinegary tang that cuts through rich pork or firm fish. Heat with purpose.",
    ingredients: ["Kashmiri chilli", "Garlic", "Ginger", "Cumin", "Mustard", "Black pepper", "Turmeric"],
    origin: "Goa",
    shelfLife: "9 months",
    spiceLevel: "Fiery",
    cookingTime: "40 min",
    servings: "Serves 5",
    tags: ["vinegary", "bold"],
    hue: 12,
  },
  {
    id: "p15",
    name: "Kerala Fish Pickle Masala",
    slug: "kerala-fish-pickle-masala",
    categoryId: "pickles",
    price: 235,
    mrp: 265,
    weight: "120 g",
    rating: 4.6,
    reviewCount: 88,
    shortDesc: "Pickle your catch the Kerala way.",
    description:
      "A blend for preserving fried fish in a spiced, gingery oil — fenugreek and mustard for the cure, Kashmiri chilli for the colour. A jar of this keeps for weeks.",
    ingredients: ["Kashmiri chilli", "Fenugreek", "Mustard", "Ginger", "Garlic", "Asafoetida", "Turmeric"],
    origin: "Kollam, Kerala",
    shelfLife: "9 months",
    spiceLevel: "Hot",
    cookingTime: "45 min",
    servings: "1 large jar",
    tags: ["preserve"],
    hue: 28,
  },
  {
    id: "p16",
    name: "Sun-Cured Lime Pickle",
    slug: "sun-cured-lime-pickle",
    categoryId: "pickles",
    price: 220,
    mrp: 250,
    weight: "300 g",
    rating: 4.8,
    reviewCount: 245,
    bestSeller: true,
    shortDesc: "Tangy, oily, slow-aged in sesame oil.",
    description:
      "Whole limes cured for three weeks in cold-pressed sesame oil with fenugreek, mustard and chilli — soft, tangy pieces that wake up curd rice. No preservatives, no shortcuts.",
    ingredients: ["Lime", "Sesame oil", "Fenugreek", "Mustard", "Red chilli", "Asafoetida", "Salt"],
    origin: "House recipe",
    shelfLife: "12 months",
    spiceLevel: "Medium",
    cookingTime: "Ready to eat",
    servings: "30 servings",
    tags: ["bestseller", "cured"],
    hue: 70,
  },
  {
    id: "p17",
    name: "Raw Mango Pickle (Avakai)",
    slug: "avakai-mango-pickle",
    categoryId: "pickles",
    price: 240,
    mrp: 270,
    weight: "300 g",
    rating: 4.7,
    reviewCount: 167,
    shortDesc: "Andhra's bold, chunky raw-mango classic.",
    description:
      "Avakai the way it's made in Andhra homes — raw mango chunks in mustard oil with fenugreek, mustard powder and a deep red chilli coat. Bold, oily, unapologetic.",
    ingredients: ["Raw mango", "Mustard oil", "Mustard powder", "Fenugreek", "Red chilli", "Salt", "Turmeric"],
    origin: "Guntur, Andhra Pradesh",
    shelfLife: "12 months",
    spiceLevel: "Fiery",
    cookingTime: "Ready to eat",
    servings: "25 servings",
    tags: ["andhra", "bold"],
    hue: 58,
  },
  {
    id: "p18",
    name: "15-Minute Biryani Kit",
    slug: "biryani-kit",
    categoryId: "ready",
    price: 320,
    mrp: 360,
    weight: "400 g",
    rating: 4.6,
    reviewCount: 142,
    isNew: true,
    shortDesc: "Masala + rice + base. You bring the protein.",
    description:
      "A complete biryani kit — pre-measured basmati, our dum biryani masala and a fried-onion base. Layer, seal, dum. Fifteen minutes from kit to a properly layered biryani.",
    ingredients: ["Basmati rice", "Biryani masala", "Fried onion", "Saffron", "Mint", "Rose petals"],
    origin: "House blend",
    shelfLife: "8 months",
    spiceLevel: "Medium",
    cookingTime: "15 min",
    servings: "Serves 4",
    tags: ["kit", "new"],
    hue: 48,
  },
  {
    id: "p19",
    name: "Coconut Rice Mix",
    slug: "coconut-rice-mix",
    categoryId: "ready",
    price: 190,
    mrp: 215,
    weight: "200 g",
    rating: 4.5,
    reviewCount: 76,
    shortDesc: "Tempered coconut rice, ten minutes.",
    description:
      "A dry mix for South Indian coconut rice — desiccated coconut, roasted lentils, curry leaves and cashew. Stir into cooked rice. That's the whole recipe.",
    ingredients: ["Desiccated coconut", "Chana dal", "Curry leaves", "Cashew", "Dry red chilli", "Ginger"],
    origin: "House blend",
    shelfLife: "8 months",
    spiceLevel: "Mild",
    cookingTime: "10 min",
    servings: "Serves 4",
    tags: ["quick", "rice"],
    hue: 68,
  },
  {
    id: "p20",
    name: "Lemon Rice Mix",
    slug: "lemon-rice-mix",
    categoryId: "ready",
    price: 175,
    mrp: 200,
    weight: "200 g",
    rating: 4.6,
    reviewCount: 91,
    shortDesc: "Tangy, turmeric-yellow, lunchbox-ready.",
    description:
      "The classic chitrannam in a pouch — tangy, turmeric-warm, flecked with peanuts and curry leaves. Mixed into hot rice, it's the tiffin box's best friend.",
    ingredients: ["Peanut", "Chana dal", "Curry leaves", "Turmeric", "Dry mango", "Mustard", "Red chilli"],
    origin: "House blend",
    shelfLife: "8 months",
    spiceLevel: "Mild",
    cookingTime: "8 min",
    servings: "Serves 4",
    tags: ["quick", "rice", "tiffin"],
    hue: 62,
  },
  {
    id: "p21",
    name: "Rasam Kit (6-Serve)",
    slug: "rasam-kit",
    categoryId: "ready",
    price: 210,
    mrp: 240,
    weight: "250 g",
    rating: 4.7,
    reviewCount: 64,
    shortDesc: "Rasam powder + toor dal + tamarind, measured.",
    description:
      "A measured rasam kit — toor dal, our rasam powder, tamarind and a fresh curry-leaf tempering mix. Boil, temper, sip. Six bowls of comfort, no measuring cups.",
    ingredients: ["Toor dal", "Rasam powder", "Tamarind", "Curry leaves", "Mustard", "Ghee", "Coriander"],
    origin: "House blend",
    shelfLife: "8 months",
    spiceLevel: "Medium",
    cookingTime: "25 min",
    servings: "Serves 6",
    tags: ["kit", "comfort"],
    hue: 44,
  },
  {
    id: "p22",
    name: "Moru Curry Blend",
    slug: "moru-curry-blend",
    categoryId: "veg",
    price: 180,
    mrp: 205,
    weight: "100 g",
    rating: 4.6,
    reviewCount: 73,
    isNew: true,
    shortDesc: "Kerala spiced buttermilk curry, in 10 min.",
    description:
      "A gentle blend for moru curry — Kerala's everyday spiced buttermilk. Turmeric, cumin and fenugreek over whisked curd, tempered in coconut oil. The most underrated curry in South India.",
    ingredients: ["Turmeric", "Cumin", "Fenugreek", "Curry leaves", "Dry red chilli", "Mustard"],
    origin: "Palakkad, Kerala",
    shelfLife: "9 months",
    spiceLevel: "Mild",
    cookingTime: "10 min",
    servings: "Serves 4",
    tags: ["buttermilk", "new", "mild"],
    hue: 60,
  },
];

export const recipes: Recipe[] = [
  {
    id: "r1",
    title: "Mangalorean Chicken Curry with Roasted Coconut",
    region: "Mangalore, Karnataka",
    time: "30 min",
    serves: "4",
    difficulty: "Easy",
    productSlug: "mangalorean-chicken-masala",
    excerpt:
      "The dish that built EasyMom — a deep, coconut-rich curry that tastes like a Sunday afternoon, made on a Tuesday.",
    steps: [
      "Marinate 600g chicken in turmeric, salt and a splash of curd for 10 minutes.",
      "Bloom a teaspoon of mustard in hot coconut oil; add curry leaves and slit green chillies.",
      "Add two sliced onions and cook until deeply golden — patience here is the whole dish.",
      "Stir in 2 tablespoons of EasyMom Mangalorean Chicken Masala and cook until the oil separates.",
      "Add the chicken, toss to coat, then pour in hot water to barely cover. Simmer 18 minutes.",
      "Finish with a tablespoon of roasted coconut paste and a squeeze of lime.",
    ],
    hue: 27,
  },
  {
    id: "r2",
    title: "A Proper Pot of Sambar",
    region: "Tirunelveli, Tamil Nadu",
    time: "25 min",
    serves: "6",
    difficulty: "Easy",
    productSlug: "sambar-powder",
    excerpt:
      "Not the thin, sad version. A sambar with body, a clean tang, and the perfume of curry leaves — the way it's meant to be.",
    steps: [
      "Pressure-cook ½ cup toor dal with turmeric until mushy; mash smooth.",
      "Boil a drumstick, a handful of shallots and pearl onions until just tender.",
      "Soak a gooseberry-sized ball of tamarind, extract the pulp, and bring to a simmer with turmeric and salt.",
      "Add 2 tablespoons of EasyMom Sambar Powder and let it boil hard for 4 minutes.",
      "Combine the dal, vegetables and tamarind base; simmer 5 minutes until thick.",
      "Temper mustard, fenugreek, dry red chilli and curry leaves in sesame oil; pour over hot.",
    ],
    hue: 38,
  },
  {
    id: "r3",
    title: "Chettinad Pepper Chicken, Dry",
    region: "Karaikudi, Tamil Nadu",
    time: "25 min",
    serves: "4",
    difficulty: "Medium",
    productSlug: "chettinad-chicken-masala",
    excerpt:
      "A dry, peppery roast that clings to the chicken — best eaten off a banana leaf with rice and ghee.",
    steps: [
      "Marinate 600g bone-in chicken in ginger-garlic, turmeric and curd for 20 minutes.",
      "Dry-roast a teaspoon of fennel and a star anise; grind coarse.",
      "Sear the chicken hard in a cast-iron pan; set aside.",
      "Cook down two onions to a paste; add 2 tablespoons of Chettinad Chicken Masala and the roasted spice.",
      "Return the chicken; toss until coated and cooked through, 12 minutes.",
      "Finish with cracked pepper, curry leaves and a drizzle of ghee.",
    ],
    hue: 18,
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Anjali Rao",
    location: "Bengaluru",
    role: "Software engineer, two kids",
    quote:
      "The Mangalorean chicken masala is the only reason my family eats a proper dinner on weeknights. Tastes exactly like my mother's, in a quarter of the time.",
    rating: 5,
    product: "Mangalorean Chicken Masala",
  },
  {
    id: "t2",
    name: "Vivek Menon",
    location: "Dubai, UAE",
    role: "NRI, Kerala",
    quote:
      "I'd given up on packaged sambar powder abroad. This one actually tastes like Tamil Nadu. My Dubai kitchen finally smells right.",
    rating: 5,
    product: "Sambar Powder",
  },
  {
    id: "t3",
    name: "Priya Krishnan",
    location: "London, UK",
    role: "Doctor, mother of one",
    quote:
      "The gunpowder is dangerously good. I keep a jar at my desk at the hospital. Rice, sesame oil, podi — comfort in two minutes.",
    rating: 5,
    product: "Gunpowder (Idli Podi)",
  },
  {
    id: "t4",
    name: "Arun Kamath",
    location: "Mumbai",
    role: "Investment banker",
    quote:
      "Skeptical at first — premium pricing for masala? The fish curry blend earned it. My Mangalorean mother-in-law approved. That's the only review that matters.",
    rating: 5,
    product: "Mangalorean Fish Curry Masala",
  },
  {
    id: "t5",
    name: "Lakshmi Iyer",
    location: "Singapore",
    role: "Teacher",
    quote:
      "The rasam kit saved a sick week in our house. Proper, peppery, restorative. Tastes like someone made it for you, not from a packet.",
    rating: 5,
    product: "Rasam Kit (6-Serve)",
  },
  {
    id: "t6",
    name: "Rahul Nair",
    location: "Kochi",
    role: "Architect",
    quote:
      "Clean ingredients, no fillers, actual flavour. The Kerala stew masala is the gentlest, most fragrant thing in my pantry now.",
    rating: 4,
    product: "Kerala Chicken Stew Masala",
  },
];

export const brandStats = [
  { value: "42k+", label: "Households served" },
  { value: "100%", label: "No preservatives" },
  { value: "9", label: "South Indian regions" },
  { value: "4.8★", label: "Across 3,200 reviews" },
];

export const brandValues = [
  {
    title: "Small-batch, stone-ground",
    body: "Every blend is ground in batches under 20kg, the way it keeps its volatile oils — never industrial-scale pulverised.",
    icon: "mortar",
  },
  {
    title: "Sourced from origin",
    body: "Byadgi from Karnataka, Tellicherry from Kerala, our coriander from a single co-op in Tamil Nadu. Region matters.",
    icon: "leaf",
  },
  {
    title: "Nothing to hide",
    body: "No fillers, no added colours, no anti-caking agents. Read the back of the pouch — it reads like a recipe.",
    icon: "shield",
  },
  {
    title: "Built for the modern stove",
    body: "Blended so a 15-minute cook still tastes like a 90-minute one. Convenience without compromise is the whole point.",
    icon: "flame",
  },
];

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}
export function getCategoryById(id: string) {
  return categories.find((c) => c.id === id);
}
export function productsByCategory(categoryId: string) {
  return products.filter((p) => p.categoryId === categoryId);
}
