import type { Metadata } from "next";
import { LanguageProvider } from "@/components/language-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Endless Pursuit | UIMIX",
  description: "UIMIX creative portfolio: design, code, and interactive experiments.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body><LanguageProvider>{children}</LanguageProvider></body>
    </html>
  );
}
