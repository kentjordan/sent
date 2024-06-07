"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import SidebarMenu from "@/components/sidebarMenu";
import BottomNavBar from "@/components/navigations/BottomNavBar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Sent!</title>
      </head>
      <body className={`${inter.className} flex h-screen w-screen flex-col`}>
        <QueryClientProvider client={new QueryClient()}>
          <Provider store={store}>
            <SidebarMenu />
            {children}
            <BottomNavBar />
          </Provider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
