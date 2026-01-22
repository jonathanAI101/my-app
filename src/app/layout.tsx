import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { I18nProvider } from "@/i18n";

export const metadata: Metadata = {
  title: "Meta Invoice System",
  description: "Meta Internal Invoice Management Tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="antialiased">
        <I18nProvider>
          <Sidebar />
          <main className="ml-64 min-h-screen bg-background">
            {children}
          </main>
        </I18nProvider>
      </body>
    </html>
  );
}
