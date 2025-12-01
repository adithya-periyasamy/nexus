"use client";

import { WorkflowContext } from "@/context/WorkflowContext";
import { ReactFlowProvider } from "@xyflow/react";
import { useState } from "react";

const Provider = ({ children }: any) => {
  const [addedNodes, setAddedNodes] = useState([
    {
      id: "start",
      position: { x: 0, y: 0 },
      data: { label: "Start" },
      type: "StartNode",
    },
  ]);
  const [nodeEdges, setNodeEdges] = useState([]);
  const [agentName, setAgentName] = useState("Agent Name");
  const [selectedNode, setSelectedNode] = useState(null);
  const [agentID, setAgentID] = useState("");
  return (
    <>
      <ReactFlowProvider>
        <WorkflowContext.Provider
          value={{
            addedNodes,
            setAddedNodes,
            nodeEdges,
            setNodeEdges,
            agentName,
            setAgentName,
            selectedNode,
            setSelectedNode,
            agentID,
            setAgentID,
          }}
        >
          <div>{children}</div>
        </WorkflowContext.Provider>
      </ReactFlowProvider>
    </>
  );
};

export default Provider;

// **Purpose:**
// - Stores the actual workflow data (nodes and edges)
// - Provides access to all child components

// **Why needed:**
// - Central place to manage workflow state
// - Every workflow starts with a "Start" node (initialized here)
// - Any component wrapped in this Provider can access/modify nodes
