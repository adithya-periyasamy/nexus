"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";

function getInitialFormData(node: any) {
  return {
    name: node?.data?.settings?.name || "API Call", // ✅ Correct path
    url: node?.data?.settings?.url || "",
    method: node?.data?.settings?.method || "GET",
    apiKey: node?.data?.settings?.apiKey || "",
    bodyParams: node?.data?.settings?.body || "",
    includeApiKey: node?.data?.settings?.includeApiKey ?? false,
  };
}

function ApiAgentSettings({ selectedNode, updateFormData }: any) {
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
      <h2 className="font-bold">API Agent</h2>
      <p className="text-gray-500 mt-1">
        Call an external API endpoint with your chosen method
      </p>

      {/* Name */}
      <div className="mt-3 space-y-1">
        <Label>Name</Label>
        <Input
          placeholder="API Agent Name"
          value={formData?.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
      </div>

      {/* Method */}
      <div className="mt-3 space-y-1">
        <Label>Request Method</Label>
        <Select
          value={formData?.method}
          onValueChange={(value) => handleChange("method", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GET">GET</SelectItem>
            <SelectItem value="POST">POST</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* URL */}
      <div className="mt-3 space-y-1">
        <Label>API URL</Label>
        <Input
          placeholder="https://api.example.com/data"
          value={formData?.url}
          onChange={(e) => handleChange("url", e.target.value)}
        />
      </div>

      {/* API Key */}
      <div className="mt-3 flex justify-between items-center">
        <Label>Include API Key</Label>
        <Switch
          checked={formData?.includeApiKey}
          onCheckedChange={(checked) => handleChange("includeApiKey", checked)}
        />
      </div>

      {formData?.includeApiKey && (
        <div className="mt-3 space-y-1">
          <Label>API Key</Label>
          <Input
            type="password"
            placeholder="Enter API Key"
            value={formData?.apiKey}
            onChange={(e) => handleChange("apiKey", e.target.value)}
          />
        </div>
      )}

      {/* Body Params (Only for POST) */}
      {formData?.method === "POST" && (
        <div className="mt-3 space-y-1">
          <Label>Body Parameters (JSON)</Label>
          <Textarea
            placeholder='{ "param1": "value1", "param2": "value2" }'
            value={formData?.bodyParams}
            onChange={(e) => handleChange("bodyParams", e.target.value)}
          />
        </div>
      )}

      <Button className="w-full mt-5 cursor-pointer" onClick={handleSave}>
        Save
      </Button>
    </div>
  );
}

export default ApiAgentSettings;
