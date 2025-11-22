import { Handle, Position } from "@xyflow/react";
import { Play } from "lucide-react";

const StartNode = () => {
  return (
    <div className="bg-white rounded-2xl p-2 border px-3">
      <div className="flex gap-2 items-center">
        <Play className="p-2 rounded-lg w-8 h-8 bg-yellow-100" />
        <h2>Start</h2>
        <Handle type="source" position={Position.Right} />
      </div>
    </div>
  );
};

export default StartNode;
