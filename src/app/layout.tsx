import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Cormorant_Garamond, DM_Sans, Hind_Siliguri, Noto_Serif_Bengali } from "next/font/google";
import birthday from "@/config/birthdayConfig";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-cormorant",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
  variable: "--font-dm-sans",
});

const notoBengali = Noto_Serif_Bengali({
  subsets: ["bengali"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-bengali-serif",
});

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
  variable: "--font-bengali-sans",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tonoya-birthday.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${birthday.ui.happyBirthday.bn} · ${birthday.nickname.bn}`,
  description: `${birthday.introSub.bn} ${birthday.introSub.en}`,
  openGraph: {
    title: `${birthday.ui.happyBirthday.en}, ${birthday.nickname.en}`,
    description: birthday.introSub.en,
    images: [{ url: birthday.profilePhoto, width: 800, height: 1200 }],
  },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#070504",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="bn">
      <body
        className={`${cormorant.variable} ${dmSans.variable} ${notoBengali.variable} ${hindSiliguri.variable} bg-night text-cream antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
