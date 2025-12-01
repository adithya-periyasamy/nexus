import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";

function getInitialFormData(node: any) {
  return {
    name: node?.data?.settings?.name || "",
    message: node?.data?.settings?.message || "",
  };
}

const UserApprovalSettings = ({ selectedNode, updateFormData }: any) => {
  const [formData, setFormData] = useState(() =>
    getInitialFormData(selectedNode)
  );

  // ✅ Reset form when selected node changes
  useEffect(() => {
    setFormData(getInitialFormData(selectedNode));
  }, [selectedNode?.id]);

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value })); // [key]: value adds/overwrites the specific field
  };

  const handleSave = () => {
    console.log("Saving data for node:", selectedNode.id, formData);
    updateFormData(formData);
  };

  return (
    <div>
      <h2 className="font-bold">User Approval</h2>
      <p className="text-gray-500 mt-1">approve or reject a user request</p>

      <div className="mt-4 space-y-2">
        <Label>Name</Label>
        <Input
          placeholder="Name"
          value={formData.name}
          onChange={(event) => handleChange("name", event.target.value)}
        />
      </div>

      <div className="mt-4 space-y-2">
        <Label>Message</Label>
        <Textarea
          placeholder="describe the message to the user"
          value={formData.message}
          onChange={(event) => handleChange("message", event.target.value)}
        />
      </div>

      <div className="mt-4">
        <Button className="w-full" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default UserApprovalSettings;
