import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { userHasProExperience } from "@/lib/pro-theme";
import { userIsAdmin } from "@/lib/require-admin";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "5B Tech Support",
    template: "%s | 5B Tech Support",
  },
  description: "Guided tech support for everyday Windows issues",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isProExperience = await userHasProExperience();
  const isAdmin = await userIsAdmin();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      data-pro={isProExperience ? "true" : undefined}
    >
      <body className="flex min-h-full flex-col">
        <SiteHeader isProExperience={isProExperience} isAdmin={isAdmin} />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
