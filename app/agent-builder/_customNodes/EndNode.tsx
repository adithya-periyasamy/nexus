import { Handle, Position } from "@xyflow/react";
import { Square } from "lucide-react";

const EndNode = ({ data }: any) => {
  return (
    <div className="bg-white rounded-2xl p-2 border px-3">
      <div className="flex gap-2 items-center">
        <Square
          className="p-2 rounded-lg w-8 h-8 "
          style={{ backgroundColor: data.bgColor }}
        />
        <h2>End</h2>
        <Handle type="target" position={Position.Left} />
      </div>
    </div>
  );
};

export default EndNode;
