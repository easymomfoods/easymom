// EasyMom Foods — Database seed script
// Populates the database with products, categories, recipes, testimonials from data.ts
// Run: npx tsx prisma/seed.ts

import { db } from "../src/lib/db";

const prisma = db;

async function main() {
  console.log("Seeding database...\n");

  // --- Categories ---
  const categories = [
    { id: "green-curry", name: "Green Curry", tagline: "Coastal green, done right", description: "Aromatic green curry blend with fresh herbs, green chillies and roasted coconut — built for chicken or meat.", accent: "leaf", hue: 145, sortOrder: 1 },
    { id: "ghee-roast", name: "Ghee Roast Masala", tagline: "Rich, roasted, unmistakable", description: "Slow-roasted spices bloomed in ghee for that signature Mangalorean ghee roast — bold, deep, unforgettable.", accent: "chilli", hue: 27, sortOrder: 2 },
    { id: "fish-curry", name: "Fish Curry Masala", tagline: "Coastal tradition, bottled", description: "Mangalorean fish curry blend built on roasted kokum, red chillies and hand-pounded coconut.", accent: "turmeric", hue: 80, sortOrder: 3 },
    { id: "fish-fry", name: "Fish Fry Masala", tagline: "Crispy outside, flaky inside", description: "A sharp, tangy spice rub designed for pan-fried or deep-fried fish — coastal Kerala style.", accent: "chilli", hue: 15, sortOrder: 4 },
    { id: "red-curry", name: "Red Curry", tagline: "Deep red, full body", description: "A rich, slow-roasted red curry masala for chicken or meat — the kind that fills the whole kitchen with warmth.", accent: "chilli", hue: 0, sortOrder: 5 },
    { id: "chicken-sukka", name: "Chicken Sukka Masala", tagline: "Dry, bold, Mangalorean", description: "Roasted coconut and whole spice blend for a proper Mangalorean chicken sukka — dry, intense, addictive.", accent: "chilli", hue: 40, sortOrder: 6 },
    { id: "palli-curry", name: "Palli Curry", tagline: "Peanut-powered comfort", description: "A peanut and roasted spice blend for a rich, creamy chicken or meat curry — Andhra-style comfort food.", accent: "turmeric", hue: 60, sortOrder: 7 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: cat,
      create: cat,
    });
  }
  console.log(`Seeded ${categories.length} categories`);

  // --- Products ---
  const products = [
    {
      id: "p1", name: "Green Curry — Chicken or Meat", slug: "green-curry", categoryId: "green-curry",
      price: 129, mrp: 199, weight: "100 g", rating: 0, reviewCount: 0,
      badge: "Signature", bestSeller: true, isNew: false,
      img: "/brand/products/green-curry1.webp",
      images: JSON.stringify(["/brand/products/green-curry1.webp", "/brand/products/green-curry2.webp"]),
      shortDesc: "Coastal green curry with fresh herbs, green chillies and roasted coconut.",
      description: "An aromatic green curry paste with fresh herbs, green chillies and roasted coconut — built for chicken or meat. No prep, no oil. Just add protein and water, simmer 5 minutes.",
      ingredients: JSON.stringify(["Green chilli", "Roasted coconut", "Coriander", "Curry leaves", "Turmeric", "Cumin"]),
      origin: "Mangalore, Karnataka", shelfLife: "6 months", spiceLevel: "Medium",
      cookingTime: "5 min", servings: "Serves 4",
      tags: JSON.stringify(["coastal", "aromatic"]), hue: 145,
    },
    {
      id: "p2", name: "Ghee Roast Masala", slug: "ghee-roast-masala", categoryId: "ghee-roast",
      price: 139, mrp: 209, weight: "100 g", rating: 0, reviewCount: 0,
      badge: "Signature", bestSeller: true, isNew: false,
      img: "/brand/products/ghee-roast1.webp",
      images: JSON.stringify(["/brand/products/ghee-roast1.webp", "/brand/products/ghee-roast2.webp"]),
      shortDesc: "Slow-roasted spices bloomed in ghee for that signature Mangalorean ghee roast.",
      description: "Slow-roasted spices bloomed in ghee for that signature Mangalorean ghee roast — bold, deep, unforgettable. No prep, no oil. Just add protein and water, simmer 5 minutes.",
      ingredients: JSON.stringify(["Byadgi chilli", "Coriander", "Cumin", "Fenugreek", "Black pepper", "Curry leaves", "Turmeric"]),
      origin: "Mangalore, Karnataka", shelfLife: "6 months", spiceLevel: "Hot",
      cookingTime: "5 min", servings: "Serves 4",
      tags: JSON.stringify(["ghee-roast", "bold"]), hue: 27,
    },
    {
      id: "p3", name: "Fish Curry Masala", slug: "fish-curry-masala", categoryId: "fish-curry",
      price: 129, mrp: 199, weight: "100 g", rating: 0, reviewCount: 0,
      badge: "Signature", bestSeller: false, isNew: false,
      img: "/brand/products/fish-curry1.webp",
      images: JSON.stringify(["/brand/products/fish-curry1.webp", "/brand/products/fish-curry2.webp"]),
      shortDesc: "Mangalorean fish curry paste with roasted kokum, red chillies and coconut.",
      description: "Mangalorean fish curry paste built on roasted kokum, red chillies and hand-pounded coconut. No prep, no oil. Just add fish, water, and simmer 5 minutes.",
      ingredients: JSON.stringify(["Byadgi chilli", "Coriander", "Fenugreek", "Cumin", "Tamarind", "Mustard", "Curry leaves"]),
      origin: "Mangalore, Karnataka", shelfLife: "6 months", spiceLevel: "Hot",
      cookingTime: "5 min", servings: "Serves 4",
      tags: JSON.stringify(["coastal", "tangy"]), hue: 25,
    },
    {
      id: "p4", name: "Fish Fry Masala", slug: "fish-fry-masala", categoryId: "fish-fry",
      price: 129, mrp: 199, weight: "100 g", rating: 0, reviewCount: 0,
      badge: null, bestSeller: false, isNew: false,
      img: "/brand/products/fish-fry1.webp",
      images: JSON.stringify(["/brand/products/fish-fry1.webp", "/brand/products/fish-fry2.webp"]),
      shortDesc: "A sharp, tangy spice paste for pan-fried or deep-fried fish — Kerala style.",
      description: "A sharp, tangy spice paste designed for pan-fried or deep-fried fish — coastal Kerala style. No prep, no oil. Coat, fry, done in 5 minutes.",
      ingredients: JSON.stringify(["Kashmiri chilli", "Black pepper", "Cumin", "Coriander", "Ginger", "Garlic", "Curry leaves"]),
      origin: "Kochi, Kerala", shelfLife: "6 months", spiceLevel: "Hot",
      cookingTime: "5 min", servings: "Serves 4",
      tags: JSON.stringify(["fry", "crispy"]), hue: 15,
    },
    {
      id: "p5", name: "Red Curry — Chicken or Meat", slug: "red-curry", categoryId: "red-curry",
      price: 129, mrp: 199, weight: "100 g", rating: 0, reviewCount: 0,
      badge: "Bestseller", bestSeller: true, isNew: false,
      img: "/brand/products/red-curry1.webp",
      images: JSON.stringify(["/brand/products/red-curry1.webp", "/brand/products/red-curry2.webp"]),
      shortDesc: "A rich, slow-roasted red curry paste for chicken or meat.",
      description: "A rich, slow-roasted red curry paste for chicken or meat — the kind that fills the whole kitchen with warmth. No prep, no oil. Just add protein and water, simmer 5 minutes.",
      ingredients: JSON.stringify(["Byadgi chilli", "Coriander", "Cumin", "Black pepper", "Fenugreek", "Curry leaves", "Turmeric"]),
      origin: "Mangalore, Karnataka", shelfLife: "6 months", spiceLevel: "Hot",
      cookingTime: "5 min", servings: "Serves 4",
      tags: JSON.stringify(["bestseller", "classic"]), hue: 0,
    },
    {
      id: "p6", name: "Chicken Sukka Masala", slug: "chicken-sukka-masala", categoryId: "chicken-sukka",
      price: 129, mrp: 199, weight: "100 g", rating: 0, reviewCount: 0,
      badge: null, bestSeller: false, isNew: false,
      img: "/brand/products/chicken-sukka-masala1.webp",
      images: JSON.stringify(["/brand/products/chicken-sukka-masala1.webp", "/brand/products/chicken-sukka-masala2.webp"]),
      shortDesc: "Roasted coconut and whole spice paste for Mangalorean chicken sukka.",
      description: "Roasted coconut and whole spice paste for a proper Mangalorean chicken sukka — dry, intense, addictive. No prep, no oil. Just add chicken, water, and simmer 5 minutes.",
      ingredients: JSON.stringify(["Roasted coconut", "Byadgi chilli", "Coriander", "Cumin", "Fennel", "Curry leaves", "Turmeric"]),
      origin: "Mangalore, Karnataka", shelfLife: "6 months", spiceLevel: "Hot",
      cookingTime: "5 min", servings: "Serves 4",
      tags: JSON.stringify(["sukka", "dry-roast"]), hue: 40,
    },
    {
      id: "p7", name: "Palli Curry — Chicken or Meat", slug: "palli-curry", categoryId: "palli-curry",
      price: 139, mrp: 209, weight: "100 g", rating: 0, reviewCount: 0,
      badge: null, bestSeller: false, isNew: false,
      img: "/brand/products/palli-curry1.webp",
      images: JSON.stringify(["/brand/products/palli-curry1.webp", "/brand/products/palli-curry2.webp"]),
      shortDesc: "Peanut and roasted spice paste for a rich, creamy curry.",
      description: "A peanut and roasted spice paste for a rich, creamy chicken or meat curry — Andhra-style comfort food. No prep, no oil. Just add protein and water, simmer 5 minutes.",
      ingredients: JSON.stringify(["Peanut", "Coriander", "Red chilli", "Cumin", "Garlic", "Curry leaves", "Turmeric"]),
      origin: "Andhra Pradesh", shelfLife: "6 months", spiceLevel: "Medium",
      cookingTime: "5 min", servings: "Serves 4",
      tags: JSON.stringify(["peanut", "creamy"]), hue: 60,
    },
  ];

  for (const prod of products) {
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: prod,
      create: prod,
    });
  }
  console.log(`Seeded ${products.length} products`);

  // --- Recipes ---
  const recipes = [
    {
      id: "r1", title: "Green Curry Chicken", region: "Mangalore, Karnataka", time: "5 min",
      serves: "4", difficulty: "Easy", productSlug: "green-curry",
      excerpt: "A fragrant green curry with fresh herbs and roasted coconut — no prep, no oil, done in 5 minutes.",
      steps: JSON.stringify([
        "Add 600g cleaned chicken to a pot with a glass of water.",
        "Bring to a boil and cook until the chicken is tender.",
        "Stir in 2 tablespoons of EasyMom Green Curry paste.",
        "Simmer for 5 minutes until the curry reaches desired thickness.",
        "Serve hot with rice or roti.",
      ]),
      hue: 145,
    },
    {
      id: "r2", title: "Red Curry Chicken", region: "Mangalore, Karnataka", time: "5 min",
      serves: "4", difficulty: "Easy", productSlug: "red-curry",
      excerpt: "A rich, slow-roasted red curry that fills the kitchen with warmth — ready in 5 minutes.",
      steps: JSON.stringify([
        "Add 600g cleaned chicken to a pot with a glass of water.",
        "Bring to a boil and cook until the chicken is tender.",
        "Stir in 2 tablespoons of EasyMom Red Curry paste.",
        "Simmer for 5 minutes until the curry reaches desired thickness.",
        "Serve hot with rice or roti.",
      ]),
      hue: 0,
    },
    {
      id: "r3", title: "Ghee Roast Chicken", region: "Mangalore, Karnataka", time: "5 min",
      serves: "4", difficulty: "Medium", productSlug: "ghee-roast-masala",
      excerpt: "The iconic Mangalorean ghee roast — bold, rich, unforgettable. Ready in 5 minutes.",
      steps: JSON.stringify([
        "Add 600g cleaned chicken to a pot with a glass of water.",
        "Bring to a boil and cook until the chicken is tender.",
        "Stir in 2 tablespoons of EasyMom Ghee Roast paste.",
        "Simmer for 5 minutes until the curry reaches desired thickness.",
        "Finish with a drizzle of ghee and fresh curry leaves.",
      ]),
      hue: 27,
    },
  ];

  for (const recipe of recipes) {
    await prisma.recipe.upsert({
      where: { id: recipe.id },
      update: recipe,
      create: recipe,
    });
  }
  console.log(`Seeded ${recipes.length} recipes`);

  // --- Testimonials ---
  const testimonials = [
    { id: "t1", name: "Anjali Rao", location: "Bengaluru, Karnataka", role: "Software engineer, two kids", quote: "The Green Curry paste is the only reason my family eats a proper dinner on weeknights. Tastes exactly like my mother's, in a quarter of the time.", rating: 5, product: "Green Curry — Chicken or Meat" },
    { id: "t2", name: "Vivek Menon", location: "Mangalore, Karnataka", role: "Home cook, Kerala roots", quote: "I'd given up on packaged masala pastes. This one actually tastes like home. My kitchen finally smells right.", rating: 5, product: "Palli Curry — Chicken or Meat" },
    { id: "t3", name: "Priya Krishnan", location: "London, UK", role: "Doctor, mother of one", quote: "The Ghee Roast is dangerously good. I keep a jar ready at all times. Rice, a drizzle of ghee, this paste — comfort in two minutes.", rating: 5, product: "Ghee Roast Masala" },
    { id: "t4", name: "Arun Kamath", location: "Mumbai", role: "Investment banker", quote: "Skeptical at first — premium pricing for masala? The fish curry blend earned it. My Mangalorean mother-in-law approved. That's the only review that matters.", rating: 5, product: "Fish Curry Masala" },
    { id: "t5", name: "Lakshmi Iyer", location: "Chennai, Tamil Nadu", role: "Teacher", quote: "The Red Curry paste saved a sick week in our house. Proper, peppery, restorative. Tastes like someone made it for you, not from a packet.", rating: 5, product: "Red Curry — Chicken or Meat" },
    { id: "t6", name: "Rahul Nair", location: "Kochi, Kerala", role: "Architect", quote: "Clean ingredients, no fillers, actual flavour. The Chicken Sukka is the most fragrant thing in my pantry now.", rating: 5, product: "Chicken Sukka Masala" },
  ];

  for (const t of testimonials) {
    await prisma.testimonial.upsert({
      where: { id: t.id },
      update: t,
      create: t,
    });
  }
  console.log(`Seeded ${testimonials.length} testimonials`);

  // --- Default admin user ---
  const bcryptHash = await hashPassword("easymom2024");
  await prisma.adminUser.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      passwordHash: bcryptHash,
    },
  });
  console.log("Seeded admin user (admin / easymom2024)");

  // --- Default coupon ---
  await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: {
      code: "WELCOME10",
      discountPct: 10,
      active: true,
    },
  });
  console.log("Seeded coupon WELCOME10 (10% off)");

  console.log("\nSeed complete!");
}

// bcrypt hash
async function hashPassword(password: string): Promise<string> {
  const bcrypt = require("bcryptjs");
  return bcrypt.hashSync(password, 10);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
