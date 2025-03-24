import type { Metadata } from "next";
import { Roboto } from 'next/font/google'
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import Providers from "@/providers";
import { auth } from "@/lib/auth";

const font = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-geist-sans'
})

export const metadata: Metadata = {
  title: "Kanban",
  description: "Kanban board app is a simple way to manage tasks and projects.",
};

// export const runtime = "nodejs";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="./logo.png" type="image/png" sizes="32x32" />
      </head>
      <body
        className={`${font.variable} antialiased bg-muted/60 dark:bg-background w-screen`}
      >
        <SessionProvider session={session}>
          <Providers>
            {children}
          </Providers>
        </SessionProvider>
      </body>
    </html>
  );
}
