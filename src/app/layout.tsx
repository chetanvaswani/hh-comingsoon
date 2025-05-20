import type { Metadata } from "next";
import "./globals.css";
import React from "react";

export const metadata: Metadata = {
  title: "Helping Hands: Trusted Maids & AC Services in Bhilai",
  description: "Hire verified maids, cooks, and professionals in Bhilai and India with Helping Hands. Affordable, reliable, safe. Book now!",
  keywords: ["maid services Bhilai", "verified cooks India", "Helping Hands India", "trusted house help", "home cleaning Bhilai"],
  openGraph: {
    title: "Helping Hands: Trusted Maids & Cooks in India",
    description: "Hire verified maids and cooks in Bhilai and India. Safe, affordable, reliable. Book with Helping Hands today!",
    type: "website",
    url: "https://helpinghandsindia.co",
    images: [{ url: "https://helpinghandsindia.co/og-image.jpg" }],
  },
  icons: {
    icon: "/HH-favicon.png",
    shortcut: "/HH-favicon.png",
    apple: "/HH-favicon.png",
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
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
