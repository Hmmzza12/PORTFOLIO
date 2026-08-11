import type { Metadata, Viewport } from "next";
import { Space_Grotesk, JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hamza Touaban — Full-Stack Software Engineer",
  description:
    "Cinematic, AI-driven developer portfolio. Spring Boot, React, TypeScript and JWT-secured architectures — engineered for performance.",
  keywords: [
    "Full-Stack Engineer",
    "Spring Boot",
    "React",
    "TypeScript",
    "Next.js",
    "Portfolio",
  ],
  authors: [{ name: "Hamza Touaban" }],
  openGraph: {
    title: "Hamza Touaban — Full-Stack Software Engineer",
    description:
      "Cinematic, AI-driven developer portfolio engineered for performance.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0C",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${inter.variable}`}
    >
      <body className="bg-base text-ink font-body antialiased">{children}</body>
    </html>
  );
}
