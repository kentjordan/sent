"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Sent!</title>
      </head>
      <body className={inter.className}>
        <QueryClientProvider client={new QueryClient()}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
