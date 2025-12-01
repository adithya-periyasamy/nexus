import { WorkflowContext } from "@/context/WorkflowContext";

import {
  Merge,
  MousePointer,
  Repeat,
  Square,
  ThumbsUp,
  Webhook,
} from "lucide-react";
import { useContext } from "react";

const AgentTools = [
  {
    name: "Agent",
    icon: MousePointer,
    bgColor: "#CDF7E8", // Light mint green
    id: "agent",
    type: "AgentNode",
  },
  {
    name: "End",
    icon: Square,
    bgColor: "#FFE3E3", // Soft pastel red
    id: "end",
    type: "EndNode",
  },
  {
    name: "IfElse",
    icon: Merge,
    bgColor: "#FFF3CD", // Light pastel yellow
    id: "ifElse",
    type: "IfElseNode",
  },
  {
    name: "While",
    icon: Repeat,
    bgColor: "#E3F2FD", // Light blue
    id: "while",
    type: "WhileNode",
  },
  {
    name: "User Approval",
    icon: ThumbsUp,
    bgColor: "#EADCFB", // Light lavender
    id: "approval",
    type: "UserApprovalNode",
  },
  {
    name: "API",
    icon: Webhook,
    bgColor: "#D1F0FF", // Light cyan
    id: "api",
    type: "ApiNode",
  },
];

// **Purpose:** Add new nodes to the workflow

// **Step-by-step flow:**
// 1. User clicks "Agent" tool
// 2. Create new node object with unique ID
// 3. Add to Context's addedNodes array
// 4. AgentBuilder's useEffect detects change
// 5. Updates local nodes state
// 6. ReactFlow renders the new node on canvas

const AgentToolsPanel = () => {
  const { addedNodes, setAddedNodes } = useContext(WorkflowContext);

  const onAgentToolClick = (tool: any) => {
    const newNode = {
      id: `${tool.id}-${Date.now()}`,
      position: { x: 0, y: 100 },
      data: { label: tool.name, ...tool },
      type: tool.type,
    };
    setAddedNodes((prevNodes: any) => [...prevNodes, newNode]);
  };
  return (
    <>
      <div className="bg-white p-5 rounded-2xl shadow">
        <h2 className="font-semibold mb-4 text-gray-700">AI Agent Tools</h2>
        <div>
          {AgentTools.map((tool, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100 rounded-xl"
              onClick={() => onAgentToolClick(tool)}
            >
              <tool.icon
                className="p-2 rounded-lg w-8 h-8 "
                style={{ backgroundColor: tool.bgColor }}
              />
              <h3 className="text-sm font-medium text-gray-700">{tool.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AgentToolsPanel;

// AgentToolsPanel → writes to → Context → syncs to → AgentBuilder → passes to → ReactFlow → renders → Custom Node Component
