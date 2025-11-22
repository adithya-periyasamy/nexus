import { Handle, Position } from "@xyflow/react";
import { MousePointer2 } from "lucide-react";

const AgentNode = () => {
  return (
    <div className="bg-white rounded-2xl p-2 border px-3">
      <div className="flex gap-2 items-center">
        <MousePointer2 className="p-2 rounded-lg w-8 h-8 bg-green-100" />
        <div className="flex flex-col">
          <h2>Agent</h2>
          <p className="text-xs text-gray-500">Agent</p>
        </div>
        <Handle type="source" position={Position.Right} />
        <Handle type="target" position={Position.Left} />
      </div>
    </div>
  );
};

export default AgentNode;
