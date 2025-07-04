import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { Toaster } from 'sonner';
import Header from "@/components/Header";
import ThemeProvider from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('lexical-mini-theme');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                }
                const font = localStorage.getItem('lexical-mini-font');
                if (font) {
                  document.documentElement.style.setProperty('--font-body', font);
                }
                const size = localStorage.getItem('lexical-mini-size');
                if (size) {
                  document.documentElement.style.setProperty('--font-size', size + 'px');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <ThemeProvider>
            <Header />
            <Toaster position="bottom-right" richColors />
            {children}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}