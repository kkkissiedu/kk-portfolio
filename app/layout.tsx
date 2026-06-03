import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { ProjectModalProvider } from "@/context/ProjectModalContext";
import ProjectModal from "@/components/ProjectModal";
import { ServiceModalProvider } from "@/context/ServiceModalContext";
import StructuredData from "@/components/StructuredData";
import ScrollTriggerInit from "@/app/components/ScrollTriggerInit";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kkkissiedu.com"),
  icons: {
    icon: [{ url: "/favicon.ico" }],
  },
  title: "Kwabena Kissiedu | Structural Engineer, ML Researcher, 3D Designer",
  description:
    "Personal portfolio of Kwabena Kwayisi Kissiedu — a First Class Civil Engineer applying Physics-Informed AI, structural analysis, and immersive 3D design to Ghana's infrastructure challenges.",
  openGraph: {
    title: "Kwabena Kissiedu | Structural Engineer, ML Researcher, 3D Designer",
    description:
      "Civil Engineer building AI-driven tools for safer infrastructure — from structural analysis to Physics-Informed Neural Networks and 3D synthetic data generation.",
    url: "https://kkkissiedu.com",
    siteName: "Kwabena Kissiedu",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kwabena Kissiedu — Structural Engineer, ML Researcher & 3D Designer",
      },
    ],
    locale: "en_GH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kwabena Kissiedu | Structural Engineer, ML Researcher, 3D Designer",
    description:
      "Civil Engineer building AI-driven tools for safer infrastructure — from structural analysis to Physics-Informed Neural Networks.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://kkkissiedu.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-dark-text overflow-x-hidden">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-[#C9952A] focus:text-[#0D0D0D] focus:text-sm focus:tracking-widest focus:uppercase"
        >
          Skip to content
        </a>
        <StructuredData />
        <ScrollTriggerInit />
        <ProjectModalProvider>
          <ServiceModalProvider>
            {children}
            <ProjectModal />
          </ServiceModalProvider>
        </ProjectModalProvider>
      </body>
    </html>
  );
}
