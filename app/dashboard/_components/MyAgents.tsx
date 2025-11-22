"use client";

import { AgentType } from "@/types/AgentType";
import { BrainCircuit } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import { useState } from "react";

const MyAgents = () => {
  const [agents, setAgents] = useState<AgentType[]>([]);
  return (
    <>
      <div className="w-full mt-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {agents.map((agents, index) => (
            <Link
              href={`/agent-builder/${agents.agentId}`}
              key={index}
              className="p-3 border rounded-2xl shadow"
            >
              <BrainCircuit className="bg-yellow-100 p-1 rounded-sm h-8 w-8" />
              <h2 className="mt-3">{agents.name}</h2>
              <h3>{moment(agents.createdAt).fromNow()}</h3>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default MyAgents;
