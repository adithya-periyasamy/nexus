import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useEffect, useState } from "react";

function getInitialFormData(node: any) {
  return {
    output: node?.data?.settings?.output || "", //structure of node in db and react flow
  };
}

const EndSettings = ({ selectedNode, updateFormData }: any) => {
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
      <h2 className="font-bold">End</h2>
      <p className="text-gray-500 mt-1">Choose the workflow output</p>

      <div className="mt-4 space-y-2">
        <Label>Output</Label>
        <Textarea
          placeholder="{name: Adi}"
          value={formData.output}
          onChange={(event) => handleChange("output", event.target.value)}
        />
      </div>

      <Button className="w-full mt-5 cursor-pointer" onClick={handleSave}>
        Save
      </Button>
    </div>
  );
};

export default EndSettings;
