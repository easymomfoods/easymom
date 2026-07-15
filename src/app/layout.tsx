import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { CartToast } from "@/components/site/cart-toast";
import { PageLoader } from "@/components/site/page-loader";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://easymom.co.in"),
  title: {
    default: "EasyMom Foods — Authentic South Indian Masalas, Made Effortless",
    template: "%s · EasyMom Foods",
  },
  description:
    "Premium authentic South Indian masalas and ready-to-cook blends from Mangalore and Kerala. Homemade taste, fast cooking, no preservatives. Trusted by 42,000+ families across India and abroad.",
  keywords: [
    "EasyMom",
    "South Indian masala",
    "Mangalorean recipes",
    "Kerala spices",
    "ghee roast masala",
    "green curry paste",
    "red curry paste",
    "fish curry masala",
    "chicken sukka masala",
    "ready to cook",
    "premium spices India",
    "no preservative masala",
    "instant curry paste",
  ],
  authors: [{ name: "EasyMom Foods" }],
  creator: "EasyMom Foods",
  publisher: "EasyMom Foods",
  icons: {
    icon: "/brand/easymom-logo.png",
    apple: "/brand/easymom-logo.png",
  },
  openGraph: {
    title: "EasyMom Foods — Authentic South Indian Masalas, Made Effortless",
    description:
      "Premium South Indian masalas from Mangalore. No prep, no oil, ready in 5 minutes. Trusted by 42,000+ families.",
    url: "https://easymom.co.in",
    siteName: "EasyMom Foods",
    images: [
      {
        url: "/brand/easymom-logo.png",
        width: 1200,
        height: 630,
        alt: "EasyMom Foods — Authentic South Indian Masalas",
      },
    ],
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "EasyMom Foods — Authentic South Indian Masalas",
    description:
      "Premium South Indian masalas from Mangalore. No prep, no oil, ready in 5 minutes.",
    images: ["/brand/easymom-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: "https://easymom.co.in" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "EasyMom Foods",
  url: "https://easymom.co.in",
  logo: "https://easymom.co.in/brand/easymom-logo.png",
  description:
    "Premium authentic South Indian masalas and ready-to-cook blends from Mangalore and Kerala. No prep, no oil, ready in 5 minutes.",
  knowsAbout: ["South Indian cuisine", "Masala blends", "Mangalorean recipes", "Kerala spices"],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91 99012 61232",
    contactType: "customer service",
    email: "easymomfoods@gmail.com",
  },
  sameAs: [
    "https://www.instagram.com/easymomfoods/",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} font-sans antialiased bg-background text-foreground`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Toaster />
        <SonnerToaster position="bottom-right" richColors />
        <CartToast />
        <PageLoader />
      </body>
    </html>
  );
}
