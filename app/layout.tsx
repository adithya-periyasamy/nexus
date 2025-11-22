import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Provider from "./Provider";

export const metadata: Metadata = {
  title: "Nexus",
  description: "Build your own AI Agents",
};

const outfit = Outfit({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        {/* Toast provider must be inside <body> */}
        <Toaster position="top-center" richColors />
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}

// **Purpose:** Wraps your entire app so Context is available everywhere

// **Why needed:**
// - Context must wrap all components that need access to it
// - Putting it in root layout means ANY page can access workflow data
// - Also adds Toaster for notifications

// **What it does:**
// ```
// App starts
//   → Provider initializes with default "Start" node
//   → All pages now have access to addedNodes/setAddedNodes
