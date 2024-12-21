import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MainSidebar } from "@/components/main-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { SettingsProvider } from "@/contexts/settings-context"
import { StoriesProvider } from "@/contexts/stories-context"
import { WorldInfoProvider } from "@/contexts/world-info-context"
import { FirstTimeWarning } from "@/components/first-time-warning";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "sillywriter",
  description: "sillywriter is a tool for creating and managing stories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <WorldInfoProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SettingsProvider>
              <StoriesProvider>
                <FirstTimeWarning />
                <div className="flex min-h-screen">
                  <aside className="w-64 border-r">
                    <MainSidebar />
                  </aside>
                  <main className="flex-1">
                    {children}
                  </main>
                </div>
              </StoriesProvider>
            </SettingsProvider>
          </ThemeProvider>
        </WorldInfoProvider>
      </body>
    </html>
  );
}
