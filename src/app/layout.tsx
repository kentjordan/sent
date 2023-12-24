"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import SidebarMenu from "@/components/sidebar_menu";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Sent!</title>
      </head>
      <body className={`${inter.className} flex h-screen`}>
        <QueryClientProvider client={new QueryClient()}>
          <Provider store={store}>
            <SidebarMenu />
            {children}
          </Provider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
