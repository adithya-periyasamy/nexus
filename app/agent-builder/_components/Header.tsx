"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, Code2, Play, X } from "lucide-react";
import Link from "next/link";

const Header = ({ agentName = "", agentId = "", isPreview = false }: any) => {
  return (
    <>
      <div className="w-full p-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link href={"/dashboard"}>
            <ChevronLeft className="h-8 w-8 cursor-pointer hover:bg-gray-100 rounded-md p-1" />
          </Link>
          <h2 className="text-xl">{agentName}</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost">
            <Code2 /> Code
          </Button>
          {!isPreview ? (
            <Link href={`/agent-builder/${agentId}/preview`}>
              <Button className="cursor-pointer">
                <Play /> Preview
              </Button>
            </Link>
          ) : (
            <Link href={`/agent-builder/${agentId}`}>
              <Button className="cursor-pointer" variant={"outline"}>
                <X /> Close Preview
              </Button>
            </Link>
          )}

          <Button>Publish</Button>
        </div>
      </div>
    </>
  );
};

export default Header;
