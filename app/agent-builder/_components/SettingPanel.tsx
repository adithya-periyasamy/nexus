import { WorkflowContext } from "@/context/WorkflowContext";
import { useParams } from "next/navigation";
import { useCallback, useContext } from "react";
import { toast } from "sonner";
import AgentSettings from "../_nodeSettings/AgentSettings";
import ApiSettings from "../_nodeSettings/ApiSettings";
import EndSettings from "../_nodeSettings/EndSettings";
import IfElseSettings from "../_nodeSettings/IfElseSettings";
import UserApprovalSettings from "../_nodeSettings/UserApprovalSettings";
import WhileSettings from "../_nodeSettings/WhileSettings";

const SettingPanel = () => {
  const {
    selectedNode,
    setSelectedNode,
    setAddedNodes,
    addedNodes,
    nodeEdges,
  } = useContext(WorkflowContext);
  const params = useParams();
  const agentId = params.agentId as string;

  const onUpdateNodeData = useCallback(
    async (formData: any) => {
      // 1. Create updated nodes array
      const updatedNodes = addedNodes.map((node: any) =>
        node.id === selectedNode?.id
          ? {
              ...node,
              data: {
                ...node.data,
                label: formData.name,
                settings: formData,
              },
            }
          : node
      );

      // 2. Update context
      setAddedNodes(updatedNodes); // // ← This is ASYNC, doesn't happen immediately!

      // 3. Save to database

      try {
        const res = await fetch(`/api/agent/${agentId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nodes: updatedNodes,
            edges: nodeEdges,
          }),
        });

        if (!res.ok) throw new Error("Failed to save");
        toast.success("Node settings saved!");

        // ✅Deselect node after successful save
        setSelectedNode(null);
      } catch (error) {
        console.error("Save error:", error);
        toast.error("Failed to save settings");
      } finally {
      }
    },
    [selectedNode?.id]
  );

  // Don't show anything if no node selected OR if StartNode is selected
  if (!selectedNode || selectedNode.type === "StartNode") {
    return null;
  }

  return (
    <div className="p-5 bg-white rounded-2xl w-[350px] shadow">
      {selectedNode?.type === "AgentNode" && (
        <AgentSettings
          selectedNode={selectedNode}
          updateFormData={onUpdateNodeData}
        />
      )}
      {selectedNode?.type === "EndNode" && (
        <EndSettings
          selectedNode={selectedNode}
          updateFormData={onUpdateNodeData}
        />
      )}

      {selectedNode?.type === "IfElseNode" && (
        <IfElseSettings
          selectedNode={selectedNode}
          updateFormData={onUpdateNodeData}
        />
      )}

      {selectedNode?.type === "WhileNode" && (
        <WhileSettings
          selectedNode={selectedNode}
          updateFormData={onUpdateNodeData}
        />
      )}

      {selectedNode?.type === "UserApprovalNode" && (
        <UserApprovalSettings
          selectedNode={selectedNode}
          updateFormData={onUpdateNodeData}
        />
      )}

      {selectedNode?.type === "ApiNode" && (
        <ApiSettings
          selectedNode={selectedNode}
          updateFormData={onUpdateNodeData}
        />
      )}
    </div>
  );
};

export default SettingPanel;
