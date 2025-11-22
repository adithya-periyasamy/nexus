import { Button } from "@/components/ui/button";
import { Handle, Position } from "@xyflow/react";
import { ThumbsUp } from "lucide-react";

const UserApprovalNode = ({ data }: any) => {
  return (
    <div className="bg-white rounded-2xl p-2 border px-3">
      <div className="flex gap-2 items-center">
        <ThumbsUp
          className="p-2  mb-2 rounded-lg w-8 h-8"
          style={{ backgroundColor: data.bgColor }}
        />
        <h2>User Approval</h2>
      </div>
      <div className="flex flex-col gap-2 items-center">
        <Button variant={"outline"} disabled className="w-full">
          Approve
        </Button>
        <Button variant={"outline"} disabled className="w-full">
          Reject
        </Button>
      </div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} id={"approve"} />
      <Handle
        type="source"
        position={Position.Right}
        id={"reject"}
        style={{ top: "110px" }}
      />
    </div>
  );
};

export default UserApprovalNode;
