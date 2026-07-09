import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import TransitionLayout from "@/components/TransitionLayout";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-var",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter-var",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VISION — Futuristic Eyewear",
  description:
    "See beyond the ordinary. Premium futuristic eyewear for the forward-thinking.",
  keywords: ["eyewear", "glasses", "sunglasses", "futuristic", "luxury"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        {/* Applies saved theme before first paint to prevent flash */}
        <Script id="theme-init" strategy="beforeInteractive">{`(function(){try{var t=localStorage.getItem('vision-theme'),d=window.matchMedia('(prefers-color-scheme: light)').matches;if(t==='light'||(t===null&&d))document.documentElement.classList.add('light');}catch(e){}})();`}</Script>
      </head>
      <body suppressHydrationWarning>
        <div className="grain-overlay" aria-hidden="true" />
        <div className="scanlines" aria-hidden="true" />
        <CustomCursor />
        <TransitionLayout>
          {children}
        </TransitionLayout>
      </body>
    </html>
  );
}
