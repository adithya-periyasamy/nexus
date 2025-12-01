import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

function getInitialFormData(node: any) {
  return {
    whileCondition: node?.data?.settings?.whileCondition || "",
  };
}

const WhileSettings = ({ selectedNode, updateFormData }: any) => {
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
      <h2 className="font-bold">While</h2>
      <p className="text-gray-500 mt-1">iterate over a condition</p>

      <div className="mt-4 space-y-2">
        <Label>While</Label>
        <Input
          placeholder="Enter condition"
          value={formData.whileCondition}
          onChange={(event) =>
            handleChange("whileCondition", event.target.value)
          }
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

export default WhileSettings;
