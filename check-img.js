require('dotenv').config();
const { createClient } = require('@libsql/client');
const db = createClient({ url: process.env.TURSO_URL, authToken: process.env.TURSO_AUTH_TOKEN });

(async () => {
  const products = await db.execute("SELECT name, img, images FROM Product");
  for (const p of products.rows) {
    console.log(`${p.name}:`);
    console.log(`  img: ${p.img}`);
    console.log(`  images: ${p.images}`);
    console.log();
  }
})();
