import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import { ThemeProvider, THEME_SCRIPT } from "@/context/theme-context";
import { Waves } from "@/components/ui/waves";
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

export const metadata: Metadata = {
  title: SITE_META.title,
  description: SITE_META.description,
  metadataBase: new URL(SITE_META.url),
  openGraph: {
    title: SITE_META.title,
    description: SITE_META.description,
    url: SITE_META.url,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_META.title,
    description: SITE_META.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head suppressHydrationWarning>
        {/* Blocking theme script — prevents flash of light mode */}
        {/* suppressHydrationWarning prevents Chrome extension script injection from causing hydration errors */}
        <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] antialiased">
        <ThemeProvider>
          {/* Fixed wave background — sits behind all page content */}
          <div className="fixed inset-0 z-0 pointer-events-none">
            <Waves
              strokeColor="rgba(196,30,58,0.18)"
              backgroundColor="transparent"
              opacity={1}
            />
          </div>
          {/* Page content sits above the wave layer */}
          <div className="relative z-10">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
