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
  img?: string;
  images?: string[];
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
  active?: boolean;
  freeItemName?: string | null;
  freeItemImage?: string | null;
  createdAt?: string;
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
    id: "green-curry",
    name: "Green Curry",
    tagline: "Coastal green, done right",
    description:
      "Aromatic green curry blend with fresh herbs, green chillies and roasted coconut — built for chicken or meat.",
    count: 1,
    accent: "leaf",
    hue: 145,
  },
  {
    id: "ghee-roast",
    name: "Ghee Roast Masala",
    tagline: "Rich, roasted, unmistakable",
    description:
      "Slow-roasted spices bloomed in ghee for that signature Mangalorean ghee roast — bold, deep, unforgettable.",
    count: 1,
    accent: "chilli",
    hue: 27,
  },
  {
    id: "fish-curry",
    name: "Fish Curry Masala",
    tagline: "Coastal tradition, bottled",
    description:
      "Mangalorean fish curry blend built on roasted kokum, red chillies and hand-pounded coconut.",
    count: 1,
    accent: "turmeric",
    hue: 80,
  },
  {
    id: "fish-fry",
    name: "Fish Fry Masala",
    tagline: "Crispy outside, flaky inside",
    description:
      "A sharp, tangy spice rub designed for pan-fried or deep-fried fish — coastal Kerala style.",
    count: 1,
    accent: "chilli",
    hue: 15,
  },
  {
    id: "red-curry",
    name: "Red Curry",
    tagline: "Deep red, full body",
    description:
      "A rich, slow-roasted red curry masala for chicken or meat — the kind that fills the whole kitchen with warmth.",
    count: 1,
    accent: "chilli",
    hue: 0,
  },
  {
    id: "chicken-sukka",
    name: "Chicken Sukka Masala",
    tagline: "Dry, bold, Mangalorean",
    description:
      "Roasted coconut and whole spice blend for a proper Mangalorean chicken sukka — dry, intense, addictive.",
    count: 1,
    accent: "chilli",
    hue: 40,
  },
  {
    id: "palli-curry",
    name: "Palli Curry",
    tagline: "Peanut-powered comfort",
    description:
      "A peanut and roasted spice blend for a rich, creamy chicken or meat curry — Andhra-style comfort food.",
    count: 1,
    accent: "turmeric",
    hue: 60,
  },
];

export const products: Product[] = [
  {
    id: "p1",
    name: "Green Curry — Chicken or Meat",
    slug: "green-curry",
    categoryId: "green-curry",
    price: 129,
    mrp: 199,
    weight: "450 g",
    rating: 4.9,
    reviewCount: 120,
    badge: "Signature",
    bestSeller: true,
    img: "/brand/products/green-curry1.png",
    images: ["/brand/products/green-curry2.png"],
    shortDesc: "Coastal green curry with fresh herbs, green chillies and roasted coconut.",
    description:
      "An aromatic green curry paste with fresh herbs, green chillies and roasted coconut — built for chicken or meat. No prep, no oil. Just add protein and water, simmer 5 minutes.",
    ingredients: ["Green chilli", "Roasted coconut", "Coriander", "Curry leaves", "Turmeric", "Cumin"],
    origin: "Mangalore, Karnataka",
    shelfLife: "6 months",
    spiceLevel: "Medium",
    cookingTime: "5 min",
    servings: "Serves 4",
    tags: ["coastal", "aromatic"],
    hue: 145,
  },
  {
    id: "p2",
    name: "Ghee Roast Masala",
    slug: "ghee-roast-masala",
    categoryId: "ghee-roast",
    price: 139,
    mrp: 199,
    weight: "450 g",
    rating: 4.8,
    reviewCount: 98,
    badge: "Signature",
    bestSeller: true,
    img: "/brand/products/ghee-roast1.png",
    images: ["/brand/products/ghee-roast2.png"],
    shortDesc: "Slow-roasted spices bloomed in ghee for that signature Mangalorean ghee roast.",
    description:
      "Slow-roasted spices bloomed in ghee for that signature Mangalorean ghee roast — bold, deep, unforgettable. No prep, no oil. Just add protein and water, simmer 5 minutes.",
    ingredients: ["Byadgi chilli", "Coriander", "Cumin", "Fenugreek", "Black pepper", "Curry leaves", "Turmeric"],
    origin: "Mangalore, Karnataka",
    shelfLife: "6 months",
    spiceLevel: "Hot",
    cookingTime: "5 min",
    servings: "Serves 4",
    tags: ["ghee-roast", "bold"],
    hue: 27,
  },
  {
    id: "p3",
    name: "Fish Curry Masala",
    slug: "fish-curry-masala",
    categoryId: "fish-curry",
    price: 129,
    mrp: 199,
    weight: "450 g",
    rating: 4.8,
    reviewCount: 178,
    badge: "Signature",
    img: "/brand/products/fish-curry1.png",
    images: ["/brand/products/fish-curry2.png"],
    shortDesc: "Mangalorean fish curry paste with roasted kokum, red chillies and coconut.",
    description:
      "Mangalorean fish curry paste built on roasted kokum, red chillies and hand-pounded coconut. No prep, no oil. Just add fish, water, and simmer 5 minutes.",
    ingredients: ["Byadgi chilli", "Coriander", "Fenugreek", "Cumin", "Tamarind", "Mustard", "Curry leaves"],
    origin: "Mangalore, Karnataka",
    shelfLife: "6 months",
    spiceLevel: "Hot",
    cookingTime: "5 min",
    servings: "Serves 4",
    tags: ["coastal", "tangy"],
    hue: 25,
  },
  {
    id: "p4",
    name: "Fish Fry Masala",
    slug: "fish-fry-masala",
    categoryId: "fish-fry",
    price: 129,
    mrp: 199,
    weight: "450 g",
    rating: 4.7,
    reviewCount: 112,
    img: "/brand/products/fish-fry1.png",
    images: ["/brand/products/fish-fry2.png"],
    shortDesc: "A sharp, tangy spice paste for pan-fried or deep-fried fish — Kerala style.",
    description:
      "A sharp, tangy spice paste designed for pan-fried or deep-fried fish — coastal Kerala style. No prep, no oil. Coat, fry, done in 5 minutes.",
    ingredients: ["Kashmiri chilli", "Black pepper", "Cumin", "Coriander", "Ginger", "Garlic", "Curry leaves"],
    origin: "Kochi, Kerala",
    shelfLife: "6 months",
    spiceLevel: "Hot",
    cookingTime: "5 min",
    servings: "Serves 4",
    tags: ["fry", "crispy"],
    hue: 15,
  },
  {
    id: "p5",
    name: "Red Curry — Chicken or Meat",
    slug: "red-curry",
    categoryId: "red-curry",
    price: 129,
    mrp: 199,
    weight: "450 g",
    rating: 4.9,
    reviewCount: 200,
    badge: "Bestseller",
    bestSeller: true,
    img: "/brand/products/red-curry1.png",
    images: ["/brand/products/red-curry2.png"],
    shortDesc: "A rich, slow-roasted red curry paste for chicken or meat.",
    description:
      "A rich, slow-roasted red curry paste for chicken or meat — the kind that fills the whole kitchen with warmth. No prep, no oil. Just add protein and water, simmer 5 minutes.",
    ingredients: ["Byadgi chilli", "Coriander", "Cumin", "Black pepper", "Fenugreek", "Curry leaves", "Turmeric"],
    origin: "Mangalore, Karnataka",
    shelfLife: "6 months",
    spiceLevel: "Hot",
    cookingTime: "5 min",
    servings: "Serves 4",
    tags: ["bestseller", "classic"],
    hue: 0,
  },
  {
    id: "p6",
    name: "Chicken Sukka Masala",
    slug: "chicken-sukka-masala",
    categoryId: "chicken-sukka",
    price: 129,
    mrp: 199,
    weight: "450 g",
    rating: 4.8,
    reviewCount: 145,
    img: "/brand/products/chicken-sukka-masala1.png",
    images: ["/brand/products/chicken-sukka-masala2.png"],
    shortDesc: "Roasted coconut and whole spice paste for Mangalorean chicken sukka.",
    description:
      "Roasted coconut and whole spice paste for a proper Mangalorean chicken sukka — dry, intense, addictive. No prep, no oil. Just add chicken, water, and simmer 5 minutes.",
    ingredients: ["Roasted coconut", "Byadgi chilli", "Coriander", "Cumin", "Fennel", "Curry leaves", "Turmeric"],
    origin: "Mangalore, Karnataka",
    shelfLife: "6 months",
    spiceLevel: "Hot",
    cookingTime: "5 min",
    servings: "Serves 4",
    tags: ["sukka", "dry-roast"],
    hue: 40,
  },
  {
    id: "p7",
    name: "Palli Curry — Chicken or Meat",
    slug: "palli-curry",
    categoryId: "palli-curry",
    price: 139,
    mrp: 199,
    weight: "450 g",
    rating: 4.7,
    reviewCount: 88,
    img: "/brand/products/palli-curry1.png",
    images: ["/brand/products/palli-curry2.png"],
    shortDesc: "Peanut and roasted spice paste for a rich, creamy curry.",
    description:
      "A peanut and roasted spice paste for a rich, creamy chicken or meat curry — Andhra-style comfort food. No prep, no oil. Just add protein and water, simmer 5 minutes.",
    ingredients: ["Peanut", "Coriander", "Red chilli", "Cumin", "Garlic", "Curry leaves", "Turmeric"],
    origin: "Mangalore, Karnataka",
    shelfLife: "6 months",
    spiceLevel: "Medium",
    cookingTime: "5 min",
    servings: "Serves 4",
    tags: ["peanut", "creamy"],
    hue: 60,
  },
];

export const recipes: Recipe[] = [
  {
    id: "r1",
    title: "Green Curry Chicken",
    region: "Mangalore, Karnataka",
    time: "5 min",
    serves: "4",
    difficulty: "Easy",
    productSlug: "green-curry",
    excerpt:
      "A fragrant green curry with fresh herbs and roasted coconut — no prep, no oil, done in 5 minutes.",
    steps: [
      "Add 600g cleaned chicken to a pot with a glass of water.",
      "Bring to a boil and cook until the chicken is tender.",
      "Stir in 2 tablespoons of EasyMom Green Curry paste.",
      "Simmer for 5 minutes until the curry reaches desired thickness.",
      "Serve hot with rice or roti.",
    ],
    hue: 145,
  },
  {
    id: "r2",
    title: "Red Curry Chicken",
    region: "Mangalore, Karnataka",
    time: "5 min",
    serves: "4",
    difficulty: "Easy",
    productSlug: "red-curry",
    excerpt:
      "A rich, slow-roasted red curry that fills the kitchen with warmth — ready in 5 minutes.",
    steps: [
      "Add 600g cleaned chicken to a pot with a glass of water.",
      "Bring to a boil and cook until the chicken is tender.",
      "Stir in 2 tablespoons of EasyMom Red Curry paste.",
      "Simmer for 5 minutes until the curry reaches desired thickness.",
      "Serve hot with rice or roti.",
    ],
    hue: 0,
  },
  {
    id: "r3",
    title: "Ghee Roast Chicken",
    region: "Mangalore, Karnataka",
    time: "5 min",
    serves: "4",
    difficulty: "Medium",
    productSlug: "ghee-roast-masala",
    excerpt:
      "The iconic Mangalorean ghee roast — bold, rich, unforgettable. Ready in 5 minutes.",
    steps: [
      "Add 600g cleaned chicken to a pot with a glass of water.",
      "Bring to a boil and cook until the chicken is tender.",
      "Stir in 2 tablespoons of EasyMom Ghee Roast paste.",
      "Simmer for 5 minutes until the curry reaches desired thickness.",
      "Finish with a drizzle of ghee and fresh curry leaves.",
    ],
    hue: 27,
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Anjali Rao",
    location: "Bengaluru, Karnataka",
    role: "Software engineer, two kids",
    quote:
      "The Green Curry paste is the only reason my family eats a proper dinner on weeknights. Tastes exactly like my mother's, in a quarter of the time.",
    rating: 5,
    product: "Green Curry — Chicken or Meat",
  },
  {
    id: "t2",
    name: "Vivek Menon",
    location: "Mangalore, Karnataka",
    role: "Home cook, Kerala roots",
    quote:
      "I'd given up on packaged masala pastes. This one actually tastes like home. My kitchen finally smells right.",
    rating: 5,
    product: "Palli Curry — Chicken or Meat",
  },
  {
    id: "t3",
    name: "Priya Krishnan",
    location: "London, UK",
    role: "Doctor, mother of one",
    quote:
      "The Ghee Roast is dangerously good. I keep a jar ready at all times. Rice, a drizzle of ghee, this paste — comfort in two minutes.",
    rating: 5,
    product: "Ghee Roast Masala",
  },
  {
    id: "t4",
    name: "Arun Kamath",
    location: "Mumbai",
    role: "Investment banker",
    quote:
      "Skeptical at first — premium pricing for masala? The fish curry blend earned it. My Mangalorean mother-in-law approved. That's the only review that matters.",
    rating: 5,
    product: "Fish Curry Masala",
  },
  {
    id: "t5",
    name: "Lakshmi Iyer",
    location: "Chennai, Tamil Nadu",
    role: "Teacher",
    quote:
      "The Red Curry paste saved a sick week in our house. Proper, peppery, restorative. Tastes like someone made it for you, not from a packet.",
    rating: 5,
    product: "Red Curry — Chicken or Meat",
  },
  {
    id: "t6",
    name: "Rahul Nair",
    location: "Kochi, Kerala",
    role: "Architect",
    quote:
      "Clean ingredients, no fillers, actual flavour. The Chicken Sukka is the most fragrant thing in my pantry now.",
    rating: 5,
    product: "Chicken Sukka Masala",
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
    title: "No prep needed",
    body: "The all-in-one masala paste already includes onions, tomatoes, and essential spices. No chopping, no grinding, no measuring.",
    icon: "mortar",
    img: "/brand/box/box1.png",
  },
  {
    title: "Oil-free cooking",
    body: "The core cooking method requires no extra oil. Simply add your protein, water, and the paste — healthier without compromise.",
    icon: "leaf",
    img: "/brand/box/box2.png",
  },
  {
    title: "Nothing to hide",
    body: "No fillers, no added colours, no preservatives. Read the back of the pouch — it reads like a recipe, because it is one.",
    icon: "shield",
    img: "/brand/box/box3.png",
  },
  {
    title: "Ready in 5 minutes",
    body: "Cook restaurant-style curries in 5–10 minutes. Add protein, water, EasyMom paste, and simmer. Dinner is done.",
    icon: "flame",
    img: "/brand/box/box4.png",
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
