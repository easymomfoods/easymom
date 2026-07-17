# EasyMom Foods — Meta Ads Master Plan

## Goal
Drive leads, traffic, and sales for EasyMom Foods through Instagram & Facebook ads, generating consistent orders from Mangalore, Bangalore, Kasaragod, and nearby regions.

---

## 1. Account Setup

### Prerequisites
- Facebook Business Page → `facebook.com/easymomfoods` (create if not exists)
- Instagram Business account → convert current profile to Business (Settings → Account → Switch to Professional → Business)
- Meta Business Suite → `business.facebook.com` → create Business Account "EasyMom Foods"
- Ads Manager → linked to Instagram + Facebook Page
- Facebook Pixel + Conversions API → install on the website (next section)

### Install Facebook Pixel on Website
Add the Meta Pixel script to `layout.tsx`:

```tsx
<Script id="meta-pixel" strategy="afterInteractive">
  {`
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window,document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', 'YOUR_PIXEL_ID');
    fbq('track', 'PageView');
  `}
</Script>
```

Add event tracking for key actions:
- `fbq('track', 'AddToCart')` — on add-to-cart button click
- `fbq('track', 'InitiateCheckout')` — on checkout page
- `fbq('track', 'Purchase', { value: total, currency: 'INR' })` — on order confirmation

---

## 2. Funnel Strategy

### Top of Funnel (Awareness) — 50% of Budget
**Goal**: Reach new people, generate interest

| Ad Type | Format | Target | Budget |
|---------|--------|--------|--------|
| Reels Ads | 15-30s video | Lookalike + Interest | 30% |
| Image Carousel | 3-5 product images | Broad targeting | 20% |

**Creative Ideas**:
- 15s reel: "From Mangalore's kitchen to your stove in 5 minutes" — show product being cooked
- Carousel: "1 masala → 3 dishes" — show versatility
- UGC-style: Real customer cooking with EasyMom

### Middle of Funnel (Consideration) — 30% of Budget
**Goal**: Drive traffic to website

| Ad Type | Format | Target | Budget |
|---------|--------|--------|--------|
| Single Image | Product + offer | Engagers + Website visitors | 15% |
| Collection Ad | Shop now | Warm audiences | 15% |

**Creative Ideas**:
- Image of Red Curry with text: "No prep. No oil. Ready in 5 min."
- "Free shipping on all orders — try today"
- Comparison: vs store-bought masala

### Bottom of Funnel (Conversion) — 20% of Budget
**Goal**: Complete purchase

| Ad Type | Format | Target | Budget |
|---------|--------|--------|--------|
| Dynamic Product Ad | Product catalog | Cart abandoners | 10% |
| Single Image | Offer / discount | Website visitors + ATC | 10% |

**Creative Ideas**:
- "Still thinking about it? Get 10% off your first order"
- "Your cart is waiting → complete your order"
- Testimonial + product image

---

## 3. Audience Targeting

### Primary Location Targeting
- **Mangalore & Udupi** (radius 50km)
- **Bangalore** (radius 30km) — major growth opportunity
- **Kasaragod** (radius 30km)

### Interest Targeting
- South Indian cooking / recipes
- Home cooking / homemade food
- Kerala recipes / Mangalorean cuisine
- Spices / masalas / organic food
- Ready-to-cook / instant food mixes
- Mothers / homemakers (25-55 age)
- Working professionals who cook (25-40 age)

### Lookalike Audiences
- **1% Lookalike** of past purchasers (once you have 100+ orders)
- **1-3% Lookalike** of website visitors
- **1-3% Lookalike** of Instagram engagers

### Custom Audiences
- Website visitors (last 30 days)
- Add-to-cart but didn't purchase (last 14 days)
- Instagram profile engagers (last 30 days)
- Video viewers (watched 50%+)
- Past purchasers (exclude from awareness, target for repeat)

---

## 4. Budget & Timeline

### Daily Budget (Startup Phase)
| Stage | Duration | Daily Budget | Total |
|-------|----------|--------------|-------|
| Test | Days 1-7 | ₹500/day | ₹3,500 |
| Optimize | Days 8-21 | ₹1,000/day | ₹14,000 |
| Scale | Days 22-60 | ₹2,000-3,000/day | ₹60,000-90,000 |

### Allocation per Campaign
| Campaign | % of Budget | Daily Budget (Test Phase) |
|----------|-------------|--------------------------|
| Awareness (Reach) | 30% | ₹150 |
| Traffic (Website) | 40% | ₹200 |
| Conversion (Sales) | 30% | ₹150 |

---

## 5. Ad Creative Blueprint

### Image Creatives
- **Format**: 1080×1080 or 1080×1350
- **Primary text**: Problem → solution (15 words max)
- **Headline**: Short, benefit-driven (5 words max)
- **CTA Button**: "Shop Now" or "Order Now"
- **Colors**: EasyMom red `#891816` + gold `#c8a960` on clean backgrounds

**Template 1 — Product Hero**
```
[Clean product photo on white background]
Text: "Mangalore's favourite masala. Now at your doorstep."
CTA: Shop Now
```

**Template 2 — Food Shot**
```
[Plated dish — Red Curry, Fish Curry]
Text: "Restaurant taste. 5-minute prep. Zero preservatives."
CTA: Order Now
```

**Template 3 — Social Proof**
```
[Customer holding product]
Text: "25,000+ families trust EasyMom. Here's why →"
CTA: Learn More
```

### Video Creatives (Reels)
- **Duration**: 15s max (for awareness), 30s (for consideration)
- **First 3 seconds**: Hook — show the finished dish immediately
- **Seconds 3-10**: Show the cooking process (splash of masala in hot oil)
- **Seconds 10-15**: CTA + website URL

**Video Ideas**:
1. "5-minute Fish Curry" — time-lapse from opening packet to finished dish
2. "Kitchen Tour" — show the grinding process (authenticity)
3. "Customer reaction" — someone tasting for the first time
4. "What's in your masala?" — ingredients close-up (trust)

---

## 6. Offer Strategy

### First Order Incentive
- "Free shipping on all orders" — already live
- Add: "Use code **EASYMOM10** for 10% off your first order"

### Repeat Purchase
- "Subscribe & save 15%" — create a subscription option
- Loyalty: buy 5 get 1 free (track via admin)

### Seasonal / Festival Offers
- Onam special combo
- Diwali gift box
- Ramadan / Eid combos

### Threshold Offers
- Free shipping: ₹0 (already live — keep it)
- Free gift: Orders above ₹500 — add a free sample of another masala

---

## 7. Ad Copy Templates

### Awareness (Reels/Video)
```
Headline: 5 minutes. That's all.
Primary Text: No oil. No prep. No preservatives. Just pure Mangalorean taste.
From our kitchen to yours. 🇮🇳
```

### Traffic (Image/Carousel)
```
Headline: Free shipping — all orders
Primary Text: Restaurant-quality Fish Curry in 5 minutes?
Yes. It's possible.
EasyMom — authentic South Indian masalas, made effortless.
```

### Conversion (Retargeting)
```
Headline: Your cart misses you ❤️
Primary Text: Those masalas aren't going to cook themselves 😉
Free shipping + easy returns. Complete your order now.
```

### Abandoned Cart
```
Headline: Still thinking about it?
Primary Text: We saved your cart! 🛒
Complete your order within 24 hours and get a FREE bonus masala sample.
```

---

## 8. Testing Plan (Days 1-7)

### What to Test
| Variable | Options |
|----------|---------|
| Creative | Product photo vs Food shot vs UGC |
| Copy | Benefit-led vs Problem-led vs Curiosity |
| Audience | Interest 1 vs Interest 2 vs Location-only |
| CTA | "Shop Now" vs "Order Now" vs "Learn More" |
| Format | Single image vs Carousel vs Reel |

### Minimum Viable Test
- Run 4-6 ads per ad set
- Budget: ₹150/day per ad set
- Duration: 4+ days (minimum for learning phase)
- Winner criteria: CTR > 1.5%, CPC < ₹5, ROAS > 2x

---

## 9. Tracking & KPIs

### Key Metrics
| Metric | Benchmark | When to Check |
|--------|-----------|---------------|
| CTR | > 1.5% | After 500 impressions |
| CPC | < ₹5 | Daily |
| CPM | < ₹150 | Daily |
| Add-to-Cart Rate | > 3% | Weekly |
| Checkout Rate | > 50% of ATC | Weekly |
| ROAS | > 2x (breakeven at low budgets) | Weekly |
| Cost per Purchase | < ₹500 | Weekly |

### Track in Google Sheets
Create a daily tracker:
```
Date | Campaign | Spend | Impressions | Clicks | CTR | ATC | Purchases | Revenue | ROAS
```

---

## 10. Optimization Rules

### Kill Rules
- CTR < 0.5% after 2,000 impressions → pause ad
- CPC > ₹10 after 200 clicks → change audience
- No purchases after ₹1,000 spend → change creative

### Scale Rules
- ROAS > 3x for 3 days → double budget every 2 days
- CPA < ₹300 with > 10 purchases → create lookalike audience
- CTR > 2% → turn into broad targeting campaign

---

## 11. Instagram Content Calendar (Organic x Paid)

| Day | Organic Post | Paid Ad |
|-----|--------------|---------|
| Mon | Recipe reel (Red Curry) | Traffic to product page |
| Tue | Customer testimonial story | Retarget website visitors |
| Wed | Behind-the-scenes (grinding) | Awareness — video view |
| Thu | Product feature (Fish Curry Masala) | Traffic to shop |
| Fri | Weekend cooking reel | Conversion — offer ad |
| Sat | UGC repost | Retarget ATC abandoners |
| Sun | Rest / engagement poll | Dynamic product ads |

---

## 12. Scaling Plan

### Phase 1 (Weeks 1-2): Validation
- Budget: ₹500/day
- 1-2 campaigns
- Test 6 creatives
- Goal: Find winning audience + creative combo

### Phase 2 (Weeks 3-4): Optimization
- Budget: ₹1,000/day
- Scale winning ads
- Launch retargeting
- Goal: CPA < ₹350, ROAS > 2x

### Phase 3 (Weeks 5-8): Scale
- Budget: ₹2,000-3,000/day
- Lookalike audiences from purchasers
- Broad targeting (let Meta optimize)
- Goal: 100+ orders/month

### Phase 4 (Months 3-6): Dominance
- Budget: ₹5,000-10,000/day
- Full funnel (awareness → conversion)
- Catalog sales + dynamic ads
- Goal: 500+ orders/month, brand recognition in target cities

---

## 13. Budget Summary

| Phase | Duration | Daily Budget | Total Spend | Expected Orders |
|-------|----------|--------------|-------------|-----------------|
| Test | 2 weeks | ₹500 | ₹7,000 | 10-20 |
| Optimize | 2 weeks | ₹1,000 | ₹14,000 | 30-50 |
| Scale | 4 weeks | ₹2,500 | ₹70,000 | 150-250 |
| **Total** | **8 weeks** | — | **₹91,000** | **200-320** |

At ₹350-500 CPA, this gives ~200-320 orders in 2 months.

---

## 14. Quick Start Checklist

- [ ] Create Facebook Business Page
- [ ] Convert Instagram to Business account
- [ ] Create Meta Business Suite account
- [ ] Set up Ads Manager
- [ ] Create Facebook Pixel
- [ ] Install Pixel on website (`layout.tsx`)
- [ ] Add ATC / Purchase events to website
- [ ] Set up product catalog (for dynamic ads)
- [ ] Create first campaign (Traffic)
- [ ] Design 3-5 ad creatives
- [ ] Set daily budget ₹500
- [ ] Launch and monitor daily
- [ ] After 1 week — analyze and optimize
