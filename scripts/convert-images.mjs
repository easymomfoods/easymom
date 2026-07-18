import sharp from "sharp";
import { readdirSync, statSync } from "fs";
import { join, relative, parse } from "path";
import { fileURLToPath } from "url";

const __dirname = parse(fileURLToPath(import.meta.url)).dir;
const brandDir = join(__dirname, "..", "public", "brand");

// Unused files to skip
const unused = new Set([
  "easymom-banner1.png",
  "easymom-banner2.png",
  "easymom-banner3.png",
  "easymom-hero-mobile1.png",
  "easymom-hero-mobile2.png",
  "easymom-hero-mobile3.png",
  "story-ingredients.png",
  "hero-spices.png",
  "product-pouch.png",
]);

// Logo - keep as PNG for favicon compatibility
// Convert everything else that's used

function walk(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const results = [];
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) results.push(...walk(full));
    else if (e.name.endsWith(".png")) results.push(full);
  }
  return results;
}

const files = walk(brandDir);

async function main() {
  for (const file of files) {
    const rel = relative(brandDir, file).replace(/\\/g, "/");
    // skip unused
    if (unused.has(rel)) {
      console.log(`SKIP (unused)  ${rel}`);
      continue;
    }
    // skip logo
    if (rel === "easymom-logo.png") {
      console.log(`SKIP (logo)    ${rel}`);
      continue;
    }

    const out = file.replace(/\.png$/, ".webp");
    const stat = statSync(file);

    try {
      await sharp(file)
        .webp({ lossless: true, effort: 6 })
        .toFile(out);
      const outStat = statSync(out);
      const savedPct = ((1 - outStat.size / stat.size) * 100).toFixed(1);
      console.log(
        `OK   ${rel.padEnd(45)} ${(stat.size / 1024).toFixed(0)}KB → ${(outStat.size / 1024).toFixed(0)}KB (${savedPct}%)`
      );
    } catch (err) {
      console.error(`FAIL ${rel}: ${err.message}`);
    }
  }
}

main();
