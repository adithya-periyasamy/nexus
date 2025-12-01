"use client";

import { Button } from "@/components/ui/button";
import { UserButton } from "@/components/userbutton";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();

  const handleExploreNow = () => {
    setLoading(true);
    router.push("/dashboard");
  };

  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen text-black flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-6">
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Logo" width={35} height={35} />
          <span className="text-xl font-semibold">Nexus</span>
        </div>
        <UserButton />
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Empower Ideas with
          <br />
          Intelligent Agents
        </h1>

        <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl">
          Design agents that understand, think and take actions for you. From
          chatbots to task automators -- build smarter, faster and easier.
        </p>

        <Button
          onClick={handleExploreNow}
          size="lg"
          className="bg-purple-300 hover:bg-purple-400 text-black font-semibold px-8 py-6 rounded-full text-lg transition-all cursor-pointer"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Loading...
            </>
          ) : (
            "Explore Now"
          )}
        </Button>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-gray-500 text-sm">
        developed by{" "}
        <Link
          href="https://www.linkedin.com/in/adithya-periyasamy"
          className="text-purple-500 hover:underline"
        >
          Adithya P
        </Link>
      </footer>
    </div>
  );
}
