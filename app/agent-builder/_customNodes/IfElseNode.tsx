import { Input } from "@/components/ui/input";
import { Handle, Position } from "@xyflow/react";
import { Merge } from "lucide-react";

const IfElseNode = ({ data }: any) => {
  return (
    <div className="bg-white rounded-2xl p-2 border px-3">
      <div className="flex gap-2 items-center">
        <Merge
          className="p-2  mb-2 rounded-lg w-8 h-8"
          style={{ backgroundColor: data.bgColor }}
        />
        <h2>If/Else</h2>
      </div>
      <div className="flex flex-col gap-2 items-center max-w-[140px]">
        <Input
          placeholder="If Condition"
          className="text-sm bg-white"
          disabled
        />
        <Input
          placeholder="Else Condition"
          className="text-sm bg-white"
          disabled
        />
      </div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} id={"if"} />
      <Handle
        type="source"
        position={Position.Right}
        id={"else"}
        style={{ top: "110px" }}
      />
    </div>
  );
};

export default IfElseNode;
