import { chromium } from "playwright";

const BASE = "https://easymom.co.in";

const PAGES = [
  "/",
  "/shop",
  "/product/red-curry",
  "/product/biryani-masala",
  "/product/green-curry",
  "/product/palli-curry",
  "/product/fish-curry-masala",
  "/recipes",
  "/about",
  "/contact",
];

async function auditPage(page, url) {
  console.log(`\n========== ${url} ==========`);
  await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });

  const issues = await page.evaluate(() => {
    const results = [];

    // 1. cursor:pointer elements that aren't interactive
    document.querySelectorAll("*").forEach((el) => {
      const tag = el.tagName.toLowerCase();
      const style = getComputedStyle(el);
      const isClickableTag = ["a", "button", "input", "select", "textarea"].includes(tag);
      const hasRole = el.getAttribute("role") === "button";
      const hasOnClick = el.hasAttribute("onclick");
      const hasHref = tag === "a" && el.getAttribute("href");
      const isLabel = tag === "label" && el.getAttribute("for");
      const tabIndex = el.getAttribute("tabindex");

      const isInteractive = isClickableTag || hasRole || hasOnClick || hasHref || isLabel ||
        (tabIndex && parseInt(tabIndex) >= 0);

      // Check for cursor:pointer with pointer-events not disabled
      if (style.cursor === "pointer" && !isInteractive && style.pointerEvents !== "none") {
        // Get a useful selector
        const id = el.id ? `#${el.id}` : "";
        const cls = Array.from(el.classList).slice(0, 2).map((c) => `.${c}`).join("");
        const selector = `${tag}${id}${cls}`;
        const text = (el.textContent || "").trim().slice(0, 60);

        results.push({
          type: "cursor-pointer-not-interactive",
          selector,
          text,
          tag,
          rect: el.getBoundingClientRect(),
        });
      }
    });

    // 2. Empty <a> tags (no href or href="#")
    document.querySelectorAll("a:not([href]), a[href='#']").forEach((el) => {
      const text = (el.textContent || "").trim().slice(0, 60);
      const id = el.id ? `#${el.id}` : "";
      const cls = Array.from(el.classList).slice(0, 2).map((c) => `.${c}`).join("");
      results.push({
        type: "empty-link",
        selector: `a${id}${cls}`,
        text,
        tag: "a",
        rect: el.getBoundingClientRect(),
      });
    });

    // 3. Images with cursor:pointer not inside an <a> or button
    document.querySelectorAll("img").forEach((img) => {
      const style = getComputedStyle(img);
      if (style.cursor !== "pointer") return;
      const parent = img.parentElement;
      if (!parent || ["a", "button"].includes(parent.tagName.toLowerCase())) return;

      const id = img.id ? `#${img.id}` : "";
      const cls = Array.from(img.classList).slice(0, 2).map((c) => `.${c}`).join("");
      const src = (img.getAttribute("src") || "").slice(0, 60);
      results.push({
        type: "clickable-image-not-wrapped",
        selector: `img${id}${cls}`,
        text: src,
        tag: "img",
        rect: img.getBoundingClientRect(),
      });
    });

    return results;
  });

  // Filter visible elements only (not off-screen)
  const visible = issues.filter((i) => i.rect && i.rect.width > 0 && i.rect.height > 0);

  if (visible.length === 0) {
    console.log("  ✓ No dead click candidates found");
  } else {
    for (const issue of visible) {
      console.log(`  ✗ ${issue.type}`);
      console.log(`    Selector: ${issue.selector}`);
      console.log(`    Text:     ${issue.text || "(empty)"}`);
      console.log(`    Pos:      x=${Math.round(issue.rect.x)} y=${Math.round(issue.rect.y)} ${Math.round(issue.rect.width)}x${Math.round(issue.rect.height)}`);
    }
  }
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  for (const p of PAGES) {
    try {
      await auditPage(page, `${BASE}${p}`);
    } catch (err) {
      console.error(`  FAIL: ${err.message}`);
    }
  }

  await browser.close();
}

main();
