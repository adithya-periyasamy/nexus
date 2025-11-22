"use client";

import { Button } from "@/components/ui/button";
import { WorkflowContext } from "@/context/WorkflowContext";
import { ChevronLeft, Code2, Play } from "lucide-react";
import { useContext } from "react";

const Header = () => {
  const { agentName } = useContext(WorkflowContext);

  return (
    <>
      <div className="w-full p-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ChevronLeft className="h-8 w-8" />
          <h2 className="text-xl">{agentName}</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost">
            <Code2 /> Code
          </Button>
          <Button>
            <Play /> Play
          </Button>
          <Button>Publish</Button>
        </div>
      </div>
    </>
  );
};

export default Header;
