import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function main() {
  const product = await db.product.update({
    where: { slug: "biryani-masala" },
    data: {
      shortDesc: "A fragrant, layered spice blend for authentic Hyderabadi-style biryani — no prep, no grinding.",
      description: "A fragrant, layered spice blend built for Hyderabadi-style biryani — saffron, star anise, mace, and 14 whole spices stone-ground together. No prep, no grinding. Just add to rice and meat, layer, and dum for 15 minutes.",
      ingredients: JSON.stringify([
        "Saffron", "Star Anise", "Mace", "Green Cardamom", "Cinnamon",
        "Bay Leaf", "Cloves", "Black Pepper", "Cumin", "Coriander Seeds",
        "Nutmeg", "Fennel Seeds", "Rose Petals", "Stone Flower"
      ]),
      tags: JSON.stringify(["biryani", "whole-spice", "stone-ground", "no-prep", "hyderabadi"]),
      hue: 15,
      badge: "Bestseller",
    },
  });
  console.log("Updated:", product.name, product.id);

  const cat = await db.category.update({
    where: { id: "biryani-masala" },
    data: { tagline: "Aromatic layers, bottled", hue: 15 },
  });
  console.log("Updated category:", cat.name);
}

main().finally(() => db.$disconnect());
