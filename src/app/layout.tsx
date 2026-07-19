import type { Metadata, Viewport } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";

const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["latin", "thai"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const siteUrl = "https://naufalananta.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Naufal Ananta — Backend & AI Engineer",
    template: "%s | Naufal Ananta",
  },
  description:
    "Naufal Ananta is a Backend Engineer, AI Engineer and Open Source Developer from Indonesia building scalable backend systems, microservices, cloud infrastructure, and AI-powered applications.",
  keywords: [
    "Naufal Ananta",
    "Backend Engineer",
    "AI Engineer",
    "NestJS",
    "Microservices",
    "Cloud Infrastructure",
    "Open Source",
    "Indonesia",
    "Software Engineer",
  ],
  authors: [{ name: "Naufal Ananta", url: siteUrl }],
  creator: "Naufal Ananta",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "Naufal Ananta — Backend & AI Engineer",
    description:
      "Building scalable backend systems, microservices, cloud infrastructure, and AI-powered applications.",
    siteName: "Naufal Ananta Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Naufal Ananta — Backend & AI Engineer",
    description:
      "Building scalable backend systems, microservices, cloud infrastructure, and AI-powered applications.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#090909",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${kanit.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#090909] text-neutral-100">
        {children}
        <div className="noise-overlay" aria-hidden />
      </body>
    </html>
  );
}
