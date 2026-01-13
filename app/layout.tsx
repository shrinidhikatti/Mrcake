import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "MrCake - Fresh Bakery Delivered",
  description: "Order fresh cakes, pastries, breads, and cookies delivered to your doorstep",
  manifest: "/manifest.json",
  themeColor: "#8B4513",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MrCake",
  },
};

import Header from "@/components/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="antialiased">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
