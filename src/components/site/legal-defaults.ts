interface LegalSection {
  heading: string;
  body: string;
}

interface LegalDoc {
  title: string;
  updated: string;
  sections: LegalSection[];
}

const TERMS_SECTIONS: LegalSection[] = [
  {
    heading: "1. Acceptance of terms",
    body: "By accessing or purchasing from EasyMom Foods, you agree to be bound by these Terms of Service. If you do not agree, please do not use the site.",
  },
  {
    heading: "2. Products & pricing",
    body: "All products are subject to availability. Prices listed are inclusive of taxes unless stated otherwise and may change without prior notice.",
  },
  {
    heading: "3. Orders & payment",
    body: "Orders are confirmed once payment is successfully processed. We reserve the right to cancel any order in the event of a pricing or stock error.",
  },
  {
    heading: "4. Shipping & delivery",
    body: "Domestic orders are dispatched within 24 hours and typically delivered in 2–6 days. International delivery times vary by destination.",
  },
  {
    heading: "5. Returns & refunds",
    body: "If a product arrives damaged or is not as described, contact easymomfoods@gmail.com within 7 days for a replacement or refund.",
  },
  {
    heading: "6. Contact",
    body: "Questions about these terms? Write to us at easymomfoods@gmail.com and we'll respond within 2 business days.",
  },
];

const PRIVACY_SECTIONS: LegalSection[] = [
  {
    heading: "1. Information we collect",
    body: "We collect the information you provide when placing an order — such as your name, shipping address, email, phone number and payment details. We also collect limited usage data to improve the site.",
  },
  {
    heading: "2. How we use your information",
    body: "Your information is used to process and deliver orders, send order updates, provide customer support, and occasionally share relevant product news if you have opted in.",
  },
  {
    heading: "3. Cookies & analytics",
    body: "We use cookies to keep you signed in, remember your cart, and understand how visitors use the site. You can disable cookies in your browser settings at any time.",
  },
  {
    heading: "4. Data sharing",
    body: "We never sell your personal data. We share only what is necessary with delivery partners and payment processors to fulfil your order, and only as required by law.",
  },
  {
    heading: "5. Your rights",
    body: "You may request access to, correction of, or deletion of your personal data by emailing easymomfoods@gmail.com. We will action valid requests within 30 days.",
  },
  {
    heading: "6. Contact",
    body: "For any privacy-related questions, write to us at easymomfoods@gmail.com and we'll respond within 2 business days.",
  },
];

export function defaultLegal(docKey: string): LegalDoc {
  const isPrivacy = docKey === "privacy";
  return {
    title: isPrivacy ? "Privacy Policy" : "Terms of Service",
    updated: new Date().toISOString().slice(0, 10),
    sections: isPrivacy ? PRIVACY_SECTIONS : TERMS_SECTIONS,
  };
}
