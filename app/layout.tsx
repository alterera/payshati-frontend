import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../lib/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Payshati - Earn on Every Recharge & Bill Payment | Recharge Platform",
    template: "%s | Payshati",
  },
  description: "Payshati is India's leading recharge and bill payment platform. Earn commission on every mobile recharge, DTH recharge, electricity bill payment, and more. Recharge smart, earn every time with Payshati LLP.",
  keywords: [
    "Payshati",
    "mobile recharge",
    "DTH recharge",
    "electricity bill payment",
    "bill payment platform",
    "recharge platform India",
    "earn commission recharge",
    "mobile recharge online",
    "online bill payment",
    "recharge and earn",
    "FasTag recharge",
    "utility bill payment",
    "wallet recharge",
    "prepaid recharge",
    "postpaid bill payment",
    "Payshati LLP",
    "Indian recharge platform",
    "recharge app",
    "bill payment app",
    "digital payment platform",
    "online recharge India",
    "commission on recharge",
    "referral recharge platform",
  ],
  authors: [{ name: "Payshati LLP" }],
  creator: "Payshati LLP",
  publisher: "Payshati LLP",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://payshati.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://payshati.com",
    siteName: "Payshati",
    title: "Payshati - Earn on Every Recharge & Bill Payment",
    description: "India's leading recharge and bill payment platform. Earn commission on every mobile recharge, DTH recharge, electricity bill payment, and more. Recharge smart, earn every time.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Payshati - Recharge & Bill Payment Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Payshati - Earn on Every Recharge & Bill Payment",
    description: "India's leading recharge and bill payment platform. Earn commission on every recharge and bill payment.",
    images: ["/og-image.png"],
    creator: "@payshati",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add verification codes when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // yahoo: "your-yahoo-verification-code",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  other: {
    "company:name": "Payshati LLP",
    "company:type": "Limited Liability Partnership",
    "company:country": "India",
    "application-name": "Payshati",
    "theme-color": "#3A29FF",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Payshati",
    "msapplication-TileColor": "#3A29FF",
    "geo.region": "IN",
    "geo.placename": "India",
    "language": "English",
    "distribution": "global",
    "rating": "general",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
