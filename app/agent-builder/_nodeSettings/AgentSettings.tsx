import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useEffect, useState } from "react";

function getInitialFormData(node: any) {
  return {
    name: node?.data?.settings?.name || "",
    instruction: node?.data?.settings?.instruction || "",
    includeHistory: node?.data?.settings?.includeHistory ?? true,
    model: node?.data?.settings?.model || "gpt-3.5-turbo",
    output: node?.data?.settings?.output || "text",
    schema: node?.data?.settings?.schema || "",
  };
}

const AgentSettings = ({ selectedNode, updateFormData }: any) => {
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
      <h2 className="font-bold">Agent</h2>
      <p className="text-gray-500 mt-1">Call the AI agent with instructions</p>

      <div className="mt-4 space-y-2">
        <Label>Name</Label>
        <Input
          placeholder="Agent Name"
          value={formData.name}
          onChange={(event) => handleChange("name", event.target.value)}
        />
      </div>

      <div className="mt-4 space-y-2">
        <Label>Instructions</Label>
        <Textarea
          placeholder="Give Instructions"
          value={formData.instruction}
          onChange={(event) => handleChange("instruction", event.target.value)}
        />
      </div>

      <div className="mt-3 flex justify-between items-center">
        <Label>Include Chat History</Label>
        <Switch
          checked={formData.includeHistory}
          onCheckedChange={(checked) => handleChange("includeHistory", checked)}
        />
      </div>

      <div className="mt-5 flex justify-between items-center">
        <Label>Model</Label>
        <Select
          value={formData.model}
          onValueChange={(value) => handleChange("model", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gemini-2.5-flash">Gemini-2.5-flash</SelectItem>
            <SelectItem value="gemini-2.0-flash">Gemini-2.0-flash</SelectItem>
            <SelectItem value="gpt-4">GPT-4</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-5 space-y-2">
        <Label>Output Format</Label>

        <Tabs
          value={formData.output}
          className="w-[400px]"
          onValueChange={(value) => handleChange("output", value)}
        >
          <TabsList>
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="json">JSON</TabsTrigger>
          </TabsList>
          <TabsContent value="text">
            <h2 className="text-sm text-gray-500">
              Output will be plain text.
            </h2>
          </TabsContent>
          <TabsContent value="json">
            <Label className="mb-2">
              <h2 className="text-sm text-gray-500">Json Schema</h2>
            </Label>
            <Textarea
              placeholder="Enter Json Schema  Ex : {title: 'string'}"
              className="max-w-[300px]"
              value={formData.schema}
              onChange={(event) => handleChange("schema", event.target.value)}
            />
          </TabsContent>
        </Tabs>
      </div>

      <Button className="w-full mt-5 cursor-pointer" onClick={handleSave}>
        Save
      </Button>
    </div>
  );
};

export default AgentSettings;
