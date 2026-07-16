require('dotenv').config();
const {createClient} = require('@libsql/client');
const db = createClient({url: process.env.TURSO_URL, authToken: process.env.TURSO_AUTH_TOKEN});
(async () => {
  // Check every table for chicken-sukka or Chicken Sukka
  const tables = ['Product', 'Category', 'Testimonial', 'SiteContent', 'Recipe', 'Coupon', 'Admin'];
  for (const t of tables) {
    try {
      const r = await db.execute(`SELECT * FROM ${t}`);
      for (const row of r.rows) {
        for (const [k, v] of Object.entries(row)) {
          if (typeof v === 'string' && (v.toLowerCase().includes('chicken sukka') || v.toLowerCase().includes('chicken-sukka'))) {
            console.log(`${t}.${k}: ${v.substring(0, 150)}`);
          }
        }
      }
    } catch(e) {}
  }
  console.log('DB scan complete');
})();
