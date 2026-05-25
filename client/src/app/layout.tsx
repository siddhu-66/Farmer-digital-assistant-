import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BackgroundMesh from "@/components/layout/BackgroundMesh";
import MobileHeader from "@/components/layout/MobileHeader";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import { MultilingualChatbot } from "@/components/ai/MultilingualChatbot";
import ThemeProvider from "@/components/layout/ThemeProvider";
import { GlobalErrorBoundary } from "@/components/shared/GlobalErrorBoundary";
const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "One-to-One | Digital Farming Reimagined",
  description: "Direct connection platform for farmers and businesses.",
  manifest: "/manifest.json",
  icons: { icon: "/logo.png", apple: "/logo.png" },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased bg-[var(--theme-bg)] text-[var(--theme-text)]`}
      >
        <ThemeProvider />
        <AuthProvider>
          <LanguageProvider>
            <BackgroundMesh />
            <MobileHeader />
            <GlobalErrorBoundary>
              <main className="min-h-screen">
                {children}
                <MultilingualChatbot />
              </main>
            </GlobalErrorBoundary>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
