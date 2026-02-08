import type { Metadata } from "next";
import { Toaster } from "sonner";
import { LanguageProvider } from "./context/LanguageContext";
import { ThemeProvider } from "./context/ThemeContext";
import WhatsAppButton from "./components/WhatsAppButton";
import "./globals.css";

export const metadata: Metadata = {
  title: "TunisShoes | Luxury Footwear & Premium Sneakers",
  description: "Experience excellence with TunisShoes. Discover our curated collection of luxury footwear, designer sneakers, and timeless classics. Premium quality, exceptional style.",
  keywords: ["shoes", "luxury", "footwear", "tunis", "fashion", "sneakers"],
  openGraph: {
    title: "TunisShoes - Luxury Footwear Collection",
    description: "Premium quality footwear designed for style and comfort.",
    url: "https://tunisshoes.com",
    siteName: "TunisShoes",
    images: [
      {
        url: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1200",
        width: 1200,
        height: 630,
        alt: "TunisShoes Luxury Collection",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <LanguageProvider>
            {children}
            <Toaster
              position="top-right"
              richColors
              toastOptions={{
                style: {
                  background: '#001f3f',
                  color: '#fff',
                  border: '1px solid #d4af37',
                },
              }}
            />
            <WhatsAppButton />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
