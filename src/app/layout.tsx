import type { Metadata } from "next";
import { Outfit, JetBrains_Mono, Playfair_Display } from "next/font/google";
import { ThemeProvider, THEME_SCRIPT } from "@/context/theme-context";
import { SITE_META } from "@/lib/constants";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: SITE_META.title,
  description: SITE_META.description,
  keywords: SITE_META.keywords,
  authors: [{ name: SITE_META.name, url: SITE_META.url }],
  metadataBase: new URL(SITE_META.url),
  alternates: { canonical: SITE_META.url },
  verification: { google: "p91U9gouBG-RKkJUMOAztkclrhJNg9TZ2eKzOv5ILNg" },
  openGraph: {
    title: SITE_META.title,
    description: SITE_META.description,
    url: SITE_META.url,
    siteName: SITE_META.name,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_META.title,
    description: SITE_META.description,
    creator: "@aidendrepaniotis",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${jetbrainsMono.variable} ${playfairDisplay.variable}`}
      suppressHydrationWarning
    >
      <head suppressHydrationWarning>
        {/* Blocking theme script — prevents flash of light mode */}
        <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        {/* JSON-LD Person schema — helps Google associate this page with the name */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Aiden Drepaniotis",
              alternateName: "Aiden Drep",
              url: "https://aidendrepaniotis.com",
              sameAs: [
                "https://linkedin.com/in/aiden-drepaniotis",
                "https://github.com/drep2718",
              ],
              jobTitle: "Software Engineer",
              worksFor: { "@type": "Organization", name: "Wealth.com" },
              alumniOf: { "@type": "CollegeOrUniversity", name: "Purdue University" },
              email: "aidendrepaniotis@gmail.com",
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
