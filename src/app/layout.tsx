import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { CartToast } from "@/components/site/cart-toast";
import { PageLoader } from "@/components/site/page-loader";
import { HomepageDataProvider } from "@/lib/page-data-context";

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
    "Premium authentic South Indian masalas and ready-to-cook blends from Mangalore and Kerala. Homemade taste, fast cooking, no preservatives. Trusted by 25,000+ families. Founded by Mahammad Sinan.",
  keywords: [
    "EasyMom",
    "South Indian masala",
    "Mangalorean recipes",
    "Kerala spices",
    "ghee roast masala",
    "green curry paste",
    "red curry paste",
    "fish curry masala",
    "pepper chilli masala",
    "ready to cook",
    "premium spices India",
    "no preservative masala",
    "instant curry paste",
    "buy spices online India",
    "authentic masala online",
    "Mangalore masala delivery",
    "South Indian curry paste",
    "stone ground spices",
    "Mahammad Sinan",
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
      "Premium South Indian masalas from Mangalore. No prep, no oil, ready in 5 minutes. Trusted by 25,000+ families. Founded by Mahammad Sinan.",
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
      "Premium South Indian masalas from Mangalore. No prep, no oil, ready in 5 minutes. Founded by Mahammad Sinan.",
    images: ["/brand/easymom-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: "https://easymom.co.in" },
  other: {
    "google-site-verification": "uVqmWt6SbFPRRDvePiswBqx0tDLKGQhqWRBug1kkwUI",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "EasyMom Foods",
  url: "https://easymom.co.in",
  logo: "https://easymom.co.in/brand/easymom-logo.png",
  description:
    "Premium authentic South Indian masalas and ready-to-cook blends from Mangalore and Kerala. No prep, no oil, ready in 5 minutes. Founded by Mahammad Sinan.",
  knowsAbout: ["South Indian cuisine", "Masala blends", "Mangalorean recipes", "Kerala spices"],
  founder: {
    "@type": "Person",
    name: "Mahammad Sinan",
  },
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
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-B4ENLTFZ30"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-B4ENLTFZ30');`}
        </Script>
        <HomepageDataProvider>{children}</HomepageDataProvider>
        <Toaster />
        <SonnerToaster position="bottom-right" richColors />
        <CartToast />
        <PageLoader />
      </body>
    </html>
  );
}
