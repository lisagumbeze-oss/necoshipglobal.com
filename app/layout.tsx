import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono, Sora } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";
import { BRAND } from "@/lib/brand";

const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.websiteUrl),
  title: {
    default: `${BRAND.name} | ${BRAND.shortName}`,
    template: `%s | ${BRAND.name}`
  },
  description: BRAND.tagline,
  applicationName: BRAND.name,
  authors: [{ name: BRAND.officialName, url: BRAND.websiteUrl }],
  openGraph: {
    title: BRAND.name,
    description: BRAND.tagline,
    url: BRAND.websiteUrl,
    siteName: BRAND.officialName,
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sora.variable} ${dmSans.variable} ${jetbrains.variable}`}>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
