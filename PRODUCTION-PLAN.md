# EasyMom Foods — Production Setup Plan

---

## Current State

| Aspect | Status |
|---|---|
| Framework | Next.js 16 + React 19 + TypeScript |
| Styling | Tailwind CSS 4 |
| State | Zustand (client-side, localStorage persistence) |
| Database | Prisma + SQLite (8 tables, seeded with all data) |
| Routing | Custom SPA router (window.history.pushState) |
| Products | Database-backed (7 products, seeded) |
| Cart | Client-side only (Zustand + localStorage) |
| Payment | COD + UPI QR (manual verification) |
| Admin | Full admin panel at /admin (login, dashboard, orders, products) |
| Auth | Session-based (cookie + Upstash Redis for production) |
| API Routes | 14 routes (7 public + 7 admin) |
| Hosting | Vercel Hobby (free) |
| Domain | easymom.vercel.app (temporary) |

---

## Production Tech Stack

| Layer | Choice | Cost |
|---|---|---|
| **Hosting** | Vercel (Hobby) | Free |
| **Database** | Turso (SQLite edge) | Free (9GB, 100 queries/sec) |
| **Cache** | Upstash Redis | Free (10k cmds/day) |
| **Images** | Cloudinary | Free (25GB, 25k transforms) |
| **Admin** | Built-in /admin route | Free |
| **Payment** | COD + UPI QR (static image) | Free |
| **Email** | Future — Resend | Free (100/day) |
| **Domain** | easymom.in (Namecheap/Squad) | ~₹500-800/year |

### Monthly Cost Breakdown

| Service | Tier | Monthly Cost |
|---|---|---|
| Vercel Hobby | Free | ₹0 |
| Turso (SQLite) | Free | ₹0 |
| Upstash Redis | Free | ₹0 |
| Cloudinary | Free (25GB) | ₹0 |
| Domain (averaged) | — | ~₹50-65 |
| **Total** | | **₹50-65/month** |

### Future Scale Costs

| Service | Paid Tier | Monthly Cost |
|---|---|---|
| Turso Scaler | If exceeded free tier | ~₹300 |
| Resend Email | 50K emails/month | ~₹500 |
| Vercel Pro | If needed for commercial | ~₹1,700 |
| **Total at scale** | | **Still under ₹1,000** |

---

## Phase 1: Database Schema & Migration

### Goal
Move all hardcoded data into a proper database. Keep Prisma as ORM.

### New Database Tables

```
┌─────────────────────────────────────────────────┐
│                    Schema                       │
├─────────────────────────────────────────────────┤
│                                                 │
│  Category                                       │
│  ├── id (String, unique)                        │
│  ├── name (String)                              │
│  ├── tagline (String)                           │
│  ├── description (String)                       │
│  ├── accent (String)                            │
│  ├── hue (Int)                                  │
│  └── sortOrder (Int)                            │
│                                                 │
│  Product                                        │
│  ├── id (String, unique)                        │
│  ├── name (String)                              │
│  ├── slug (String, unique)                      │
│  ├── categoryId (FK → Category)                 │
│  ├── price (Int)                                │
│  ├── mrp (Int)                                  │
│  ├── weight (String)                            │
│  ├── rating (Float)                             │
│  ├── reviewCount (Int)                          │
│  ├── badge (String?)                            │
│  ├── bestSeller (Boolean)                       │
│  ├── isNew (Boolean)                            │
│  ├── img (String?)                              │
│  ├── images (String[] — JSON)                   │
│  ├── shortDesc (String)                         │
│  ├── description (String)                       │
│  ├── ingredients (String[] — JSON)              │
│  ├── origin (String)                            │
│  ├── shelfLife (String)                         │
│  ├── spiceLevel (String)                        │
│  ├── cookingTime (String)                       │
│  ├── servings (String)                          │
│  ├── tags (String[] — JSON)                     │
│  ├── hue (Int)                                  │
│  ├── active (Boolean, default true)             │
│  ├── createdAt (DateTime)                       │
│  └── updatedAt (DateTime)                       │
│                                                 │
│  Recipe                                         │
│  ├── id (String, unique)                        │
│  ├── title (String)                             │
│  ├── region (String)                            │
│  ├── time (String)                              │
│  ├── serves (String)                            │
│  ├── difficulty (String)                        │
│  ├── productSlug (String)                       │
│  ├── excerpt (String)                           │
│  ├── steps (String[] — JSON)                    │
│  ├── hue (Int)                                  │
│  └── active (Boolean, default true)             │
│                                                 │
│  Testimonial                                    │
│  ├── id (String, unique)                        │
│  ├── name (String)                              │
│  ├── location (String)                          │
│  ├── role (String)                              │
│  ├── quote (String)                             │
│  ├── rating (Int)                               │
│  ├── product (String)                           │
│  └── active (Boolean, default true)             │
│                                                 │
│  Order                                          │
│  ├── id (String, CUID)                          │
│  ├── orderId (String, unique — EM-XXXXXX)       │
│  ├── email (String)                             │
│  ├── name (String)                              │
│  ├── phone (String)                             │
│  ├── address (String)                           │
│  ├── city (String)                              │
│  ├── state (String)                             │
│  ├── pincode (String)                           │
│  ├── notes (String?)                            │
│  ├── subtotal (Int)                             │
│  ├── discount (Int)                             │
│  ├── shipping (Int)                             │
│  ├── total (Int)                                │
│  ├── couponCode (String?)                       │
│  ├── paymentMethod (String — "cod" | "upi_qr")  │
│  ├── paymentRef (String?)                       │
│  ├── paymentStatus (String — "pending"|"paid")  │
│  ├── status (String — confirmed|packed|          │
│  │           shipped|delivered|cancelled)        │
│  ├── itemsJson (String — JSON)                  │
│  ├── createdAt (DateTime)                       │
│  └── updatedAt (DateTime)                       │
│                                                 │
│  Coupon                                         │
│  ├── code (String, unique)                      │
│  ├── discountPct (Int)                          │
│  ├── active (Boolean)                           │
│  └── usageLimit (Int?)                          │
│                                                 │
│  NewsletterSub                                  │
│  ├── id (String, CUID)                          │
│  ├── email (String, unique)                     │
│  └── createdAt (DateTime)                       │
│                                                 │
│  AdminUser                                      │
│  ├── id (String, unique)                        │
│  ├── username (String, unique)                  │
│  ├── passwordHash (String)                      │
│  └── createdAt (DateTime)                       │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Migration Steps
1. Update prisma/schema.prisma with new models
2. Create seed script (src/lib/seed.ts) to populate Category, Product, Recipe, Testimonial from existing hardcoded data
3. Switch DATABASE_URL to Turso for production
4. Run prisma db push
5. Run seed script

---

## Phase 2: API Routes

### Public APIs (no auth needed)

| Method | Route | Purpose |
|---|---|---|
| GET | /api/products | List all products (with filters) |
| GET | /api/products/[slug] | Get single product |
| GET | /api/categories | List all categories |
| GET | /api/recipes | List all recipes |
| GET | /api/testimonials | List all testimonials |
| POST | /api/orders | Create new order |
| POST | /api/newsletter | Subscribe to newsletter |

### Admin APIs (auth required)

| Method | Route | Purpose |
|---|---|---|
| POST | /api/admin/login | Admin login |
| GET | /api/admin/orders | List all orders |
| PATCH | /api/admin/orders/[id] | Update order status |
| GET | /api/admin/products | List products (with inactive) |
| POST | /api/admin/products | Create product |
| PUT | /api/admin/products/[id] | Update product |
| DELETE | /api/admin/products/[id] | Delete product |
| GET | /api/admin/stats | Dashboard stats |

---

## Phase 3: Admin Panel

### Pages

```
/admin                  → Login page
/admin/dashboard        → Stats overview (orders today, revenue, pending)
/admin/orders           → Order list with status filters
/admin/orders/[id]      → Order detail + status update
/admin/products         → Product list with add/edit/delete
/admin/products/new     → Add new product form
/admin/products/[id]/edit → Edit product form
/admin/coupons          → Manage coupons
```

### Auth
- Simple session-based auth (no OAuth needed)
- Admin credentials stored in database (bcrypt hashed)
- Session cookie (httpOnly, secure)
- Middleware protects /admin/* routes

### Dashboard Stats
- Orders today / this week / this month
- Total revenue
- Pending orders count
- Low stock alerts
- Recent orders list

---

## Phase 4: Order Flow

### Customer Checkout Flow

```
1. Cart → Checkout modal opens
2. Fill: Name, Phone, Email, Address, City, State, Pincode
3. Select payment method:
   ├── "Cash on Delivery" → Place Order
   └── "Pay via UPI" → Show QR image + order ID
        ├── Customer scans QR with any UPI app
        ├── Enters order ID (EM-XXXXXX) as reference
        └── Clicks "I've paid" → Order placed
4. Order saved to database (status: "confirmed", paymentStatus: "pending")
5. Order confirmation shown on screen with order ID
6. (Future) Email notification sent
```

### Order Status Flow

```
confirmed → packed → shipped → delivered
    └──→ cancelled (at any point before delivered)
```

### Admin Order Management

```
/admin/orders → See all orders
├── Filter by status (confirmed, packed, shipped, delivered, cancelled)
├── Search by order ID, name, phone
├── Click order → See full details
│   ├── Customer info
│   ├── Items ordered
│   ├── Payment method + status
│   └── Status dropdown → Update status
└── Status change → Next status in flow
```

---

## Phase 5: Payment (COD + UPI QR)

### Cash on Delivery
- Customer selects "Pay on Delivery"
- Order saved with paymentMethod: "cod", paymentStatus: "pending"
- Admin marks as "paid" when delivered and cash collected
- No gateway integration needed

### UPI QR Payment
- Static QR code image stored in /public/brand/easymom-qr.png
- Customer selects "Pay via UPI"
- QR image displayed with instructions:
  1. Scan QR with any UPI app
  2. Enter order ID (EM-XXXXXX) as reference
  3. Click "I've Paid"
- Order saved with paymentMethod: "upi_qr", paymentStatus: "pending"
- Admin manually confirms payment (verifies in UPI app)
- Admin marks paymentStatus as "paid"

### Why No Payment Gateway?
- COD is the primary payment method for food products in India
- UPI QR avoids gateway fees (2-3% saved per transaction)
- For 1000 orders/month at average ₹200 order value = ₹2,00,000/month
- Saving 2.5% gateway fee = ₹5,000/month saved
- Manual UPI verification is manageable at this scale

---

## Phase 6: Bug Fixes (Completed)

### 1. CartLine Missing img Field
**File:** src/lib/store.ts
**Status:** Fixed — added `img: string` to CartLine type

### 2. DATABASE_URL Hardcoded Path
**File:** .env
**Status:** Fixed — changed to `file:./db/custom.db`

### 3. Orders API Has No Auth
**File:** src/app/api/orders/route.ts
**Status:** Fixed — public POST only, admin GET requires auth

---

## Phase 7: CartLine Bug Fix (Quick)

### Current Code
```ts
type CartLine = {
  productId: string;
  name: string;
  slug: string;
  price: number;
  weight: string;
  hue: number;
  qty: number;
  // img field is MISSING
};
```

### Fixed Code
```ts
type CartLine = {
  productId: string;
  name: string;
  slug: string;
  price: number;
  weight: string;
  img: string;  // ADD THIS
  hue: number;
  qty: number;
};
```

Also update `add()` function in store.ts to include `img: product.img` when building cart line.

---

## Phase 8: Deployment

### Vercel Setup
1. Connect GitHub repo to Vercel
2. Set environment variables:
   ```
   DATABASE_URL=file:./dev.db  (development)
   DATABASE_URL=libsql://xxx.turso.io  (production — Turso)
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD_HASH=bcrypt_hash_here
   ```
3. Deploy — auto-detected as Next.js

### Turso Setup
1. Sign up at turso.tech
2. Create database: `easymom`
3. Get connection URL: `libsql://easymom-xxx.turso.io`
4. Add auth token
5. Update prisma/schema.prisma to use `@libsql/client`
6. Run `npx prisma db push`

### Cloudinary Setup
1. Sign up at cloudinary.com
2. Create upload preset: `easymom-products`
3. Add environment variables:
   ```
   CLOUDINARY_CLOUD_NAME=xxx
   CLOUDINARY_API_KEY=xxx
   CLOUDINARY_API_SECRET=xxx
   ```
4. Product images uploaded via admin panel → stored in Cloudinary

### Domain
1. Buy easymom.in from Namecheap or Squad
2. Add to Vercel project settings
3. Update DNS to point to Vercel
4. SSL auto-provisioned by Vercel

---

## Implementation Order

| Step | Task | Est. Time | Status |
|---|---|---|---|
| 1 | Fix CartLine bug + DATABASE_URL | 15 min | Done |
| 2 | Update Prisma schema (all tables) | 30 min | Done |
| 3 | Create seed script | 30 min | Done |
| 4 | Setup Turso + migrate DB | 30 min | Pending |
| 5 | Build public API routes | 1 hour | Done |
| 6 | Build admin auth (login + session) | 1 hour | Done |
| 7 | Build admin API routes | 1 hour | Done |
| 8 | Build admin dashboard UI | 2 hours | Done |
| 9 | Build admin orders page | 1.5 hours | Done |
| 10 | Build admin products page | 1.5 hours | Done |
| 11 | Update checkout flow (COD + UPI QR) | 1 hour | Done |
| 12 | Setup Cloudinary + image upload | 1 hour | Pending |
| 13 | Deploy to Vercel + Turso | 30 min | Pending |
| 14 | Test everything end-to-end | 1 hour | Pending |

---

## Environment Variables

```env
# Database
DATABASE_URL="file:./db/custom.db"
# DATABASE_URL="libsql://easymom-xxx.turso.io?authToken=xxx" # production

# Upstash Redis (for admin sessions)
UPSTASH_REDIS_REST_URL="YOUR_URL_HERE"
UPSTASH_REDIS_REST_TOKEN="YOUR_TOKEN_HERE"

# Session secret (change in production)
SESSION_SECRET="easymom-dev-secret-change-in-prod"

# Cloudinary (future)
# CLOUDINARY_CLOUD_NAME="xxx"
# CLOUDINARY_API_KEY="xxx"
# CLOUDINARY_API_SECRET="xxx"

# Resend (future)
# RESEND_API_KEY="re_xxx"

# App
NEXT_PUBLIC_APP_URL="https://easymom.in"
```

---

## File Structure (After Production Setup)

```
src/
├── app/
│   ├── api/
│   │   ├── products/
│   │   │   ├── route.ts              (GET list)
│   │   │   └── [slug]/
│   │   │       └── route.ts          (GET single)
│   │   ├── categories/
│   │   │   └── route.ts              (GET list)
│   │   ├── recipes/
│   │   │   └── route.ts              (GET list)
│   │   ├── testimonials/
│   │   │   └── route.ts              (GET list)
│   │   ├── orders/
│   │   │   └── route.ts              (POST create)
│   │   ├── newsletter/
│   │   │   └── route.ts              (POST subscribe)
│   │   └── admin/
│   │       ├── login/
│   │       │   └── route.ts          (POST login)
│   │       ├── logout/
│   │       │   └── route.ts          (POST logout)
│   │       ├── orders/
│   │       │   ├── route.ts          (GET list — auth required)
│   │       │   └── [id]/
│   │       │       └── route.ts      (GET detail, PATCH update)
│   │       ├── products/
│   │       │   ├── route.ts          (GET list, POST create)
│   │       │   └── [id]/
│   │       │       └── route.ts      (PUT update, DELETE)
│   │       └── stats/
│   │           └── route.ts          (GET dashboard stats)
│   ├── page.tsx                      (SPA entry — admin + public views)
│   ├── [...slug]/
│   │   └── page.tsx                  (catch-all for page reload)
│   └── layout.tsx
├── components/
│   └── site/
│       ├── admin/
│       │   ├── AdminLogin.tsx         (login form)
│       │   ├── AdminDashboard.tsx     (stats + quick actions)
│       │   ├── AdminOrders.tsx        (order list + detail modal)
│       │   └── AdminProducts.tsx      (product list + edit/add modal)
│       ├── (existing components)
│       └── ...
├── lib/
│   ├── data.ts                       (existing — fallback catalog)
│   ├── store.ts                      (cart + CartLine type)
│   ├── ui-store.ts                   (view state + URL routing)
│   ├── db.ts                         (Prisma client singleton)
│   ├── auth.ts                       (session helpers + password hashing)
│   ├── session-store.ts              (Upstash Redis / in-memory fallback)
│   ├── format.ts                     (inr, orderId helpers)
│   └── ...
prisma/
├── schema.prisma                     (8 tables)
├── seed.ts                           (database seed script)
└── db/
    └── custom.db                     (SQLite — development)
```

---

## Notes

- Email notifications (Resend) are deferred to future phase
- Product images stay in /public/brand/products/ for now, Cloudinary later
- Admin panel is a simple SPA within the existing client-side architecture
- Auth is basic password-based — no OAuth needed for a single admin
- UPI QR is static — no payment gateway integration required
- This setup handles 1000 orders/month comfortably within free tiers
- Admin sessions use Upstash Redis (production) with in-memory fallback (local dev)
- Admin credentials: admin / easymom2024
- Seed script populates all 7 products, 7 categories, 3 recipes, 6 testimonials, 1 admin user, 1 coupon (WELCOME10)
