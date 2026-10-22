import type { Metadata } from "next";
import "./globals.css";
import { Inter, Playfair_Display } from "next/font/google";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";

// Mengatur font utama (Sans-serif)
const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-sans',
  display: 'swap',
});

// Mengatur font sekunder (Serif untuk judul)
const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

// Font khusus untuk tombol
const glacial = localFont({
  src: "./fonts/GlacialIndifference-Regular.otf",
  variable: "--font-glacial",
  display: "swap",
});

export const metadata: Metadata = {
  title: "JelajahVirtual ID",
  description: "Tur Virtual 360 Derajat Historis Benteng Fort Willem I (Benteng Pendem Ambarawa)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={cn("font-sans", inter.variable, playfair.variable, glacial.variable)}>
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css" />
        <script src="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js" async></script>
      </head>
      <body className={cn("font-sans antialiased selection:bg-amber-500 selection:text-white")}>
        {children}
      </body>
    </html>
  );
}
