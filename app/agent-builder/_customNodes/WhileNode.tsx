import { Input } from "@/components/ui/input";
import { Handle, Position } from "@xyflow/react";
import { Repeat } from "lucide-react";

const WhileNode = ({ data }: any) => {
  return (
    <div className="bg-white rounded-2xl p-2 border px-3">
      <div className="flex gap-2 items-center">
        <Repeat
          className="p-2  mb-2 rounded-lg w-8 h-8"
          style={{ backgroundColor: data.bgColor }}
        />
        <h2>while</h2>
      </div>
      <div className="flex flex-col gap-2 items-center max-w-[140px]">
        <Input placeholder="Condition" className="text-sm bg-white" disabled />
      </div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} id={"while"} />
    </div>
  );
};

export default WhileNode;
