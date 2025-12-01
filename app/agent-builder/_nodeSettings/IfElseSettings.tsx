import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

function getInitialFormData(node: any) {
  return {
    ifCondition: node?.data?.settings?.ifCondition || "",
  };
}

const IfElseSettings = ({ selectedNode, updateFormData }: any) => {
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
      <h2 className="font-bold">If / Else</h2>
      <p className="text-gray-500 mt-1">
        Create Conditions to branch your workflow
      </p>

      <div className="mt-4 space-y-2">
        <Label>If</Label>
        <Input
          placeholder="Enter condition"
          value={formData.ifCondition}
          onChange={(event) => handleChange("ifCondition", event.target.value)}
        />
      </div>

      <div className="mt-4">
        <Button className="w-full cursor-pointer" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default IfElseSettings;
