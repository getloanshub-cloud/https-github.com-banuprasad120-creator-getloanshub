import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DIGI LOANS | Premium Loan Advisory & CRM Platform",
  description: "Get the right loan at the right time. Managed by expert Loans Advisors at Get Loans Hub. Compare rates and apply for Personal, Business, Home, Mortgage, Auto and Gold loans.",
  keywords: "digi loans, huzurabad loans, home loan, business loan, personal loan, mortgage loan, auto loan, gold loan, loan advisory crm",
  authors: [{ name: "Get Loans Hub", url: "mailto:stardigiloanswg@gmail.com" }],
  metadataBase: new URL("https://stardigiloans.com"),
  openGraph: {
    title: "DIGI LOANS | Premium Loan Advisory & Financial Services",
    description: "Secure the lowest interest rates from multiple top banks. Instant approvals and transparent guidance by our expert advisory team.",
    type: "website",
    locale: "en_IN",
    siteName: "DIGI LOANS",
  },
  twitter: {
    card: "summary_large_image",
    title: "DIGI LOANS | Premium Loan Advisory",
    description: "Get the right loan at the right time. Apply instantly and track in real-time.",
  }
};

import ClientChatWrapper from '@/components/ClientChatWrapper';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "name": "DIGI LOANS",
    "alternateName": "Get Loans Hub",
    "url": "https://stardigiloans.com",
    "logo": "https://stardigiloans.com/logo.png",
    "description": "Secure the lowest interest rates from multiple top banks. Instant approvals and transparent guidance by our expert advisory team.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Paigah Plaza, Basheerbagh",
      "addressLocality": "Hyderabad",
      "addressRegion": "Telangana",
      "postalCode": "500063",
      "addressCountry": "IN"
    },
    "telephone": "+919000100262",
    "priceRange": "$$",
    "areaServed": "IN"
  };

  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <body className="font-sans antialiased text-slate-900 bg-slate-50 dark:bg-slate-900 dark:text-slate-100 min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <ClientChatWrapper />
      </body>
    </html>
  );
}
