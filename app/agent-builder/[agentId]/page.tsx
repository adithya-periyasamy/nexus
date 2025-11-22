"use client";
import { Button } from "@/components/ui/button";
import { WorkflowContext } from "@/context/WorkflowContext";
import {
  Background,
  BackgroundVariant,
  Controls,
  Edge,
  MiniMap,
  Node,
  Panel,
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Loader2, Save } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import AgentToolsPanel from "../_components/AgentToolsPanel";
import Header from "../_components/Header";
import AgentNode from "../_customNodes/AgentNode";
import EndNode from "../_customNodes/EndNode";
import IfElseNode from "../_customNodes/IfElseNode";
import StartNode from "../_customNodes/StartNode";

import ApiNode from "../_customNodes/ApiNode";
import UserApprovalNode from "../_customNodes/UserApprovalNode";
import WhileNode from "../_customNodes/WhileNode";

const nodeTypes = {
  StartNode: StartNode,
  AgentNode: AgentNode,
  EndNode: EndNode,
  IfElseNode: IfElseNode,
  WhileNode: WhileNode,
  UserApprovalNode: UserApprovalNode,
  ApiNode: ApiNode,
};

const AgentBuilder = () => {
  const params = useParams();
  const agentId = params.agentId as string;

  const [nodes, setNodes] = useState<Node[]>([]); // local state for nodes
  const [edges, setEdges] = useState<Edge[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { addedNodes, setAddedNodes, nodeEdges, setNodeEdges, setAgentName } =
    useContext(WorkflowContext); // global state(context) for nodes

  // Fetch agent details on mount
  useEffect(() => {
    const fetchAgent = async () => {
      try {
        console.log("Fetching agent:", agentId);
        const res = await fetch(`/api/agent/${agentId}`);

        if (!res.ok) {
          console.error("API Error:", res.status, res.statusText);
          return;
        }

        const data = await res.json();
        console.log("Agent data:", data);

        // Update context with fetched data
        setAgentName(data.name);
        setAddedNodes(data.nodes);
        setNodeEdges(data.edges);
      } catch (error) {
        console.error("Failed to fetch agent:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgent();
  }, [agentId]);

  // Initialize local state from context
  useEffect(() => {
    addedNodes && setNodes(addedNodes);
    nodeEdges && setEdges(nodeEdges); // updates the local state with context on mount and the context is retrieved from the db
  }, [addedNodes]);

  // Sync local state with context
  useEffect(() => {
    edges && setNodeEdges(edges);
    edges && console.log("Edges updated:", edges);
  }, [edges]);

  // Purpose: When user drags/deletes a node, update both local and context state
  const onNodesChange = useCallback(
    (changes: any) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );

  // Purpose: When user drags/deletes an edge, update local edge state
  const onEdgesChange = useCallback(
    (changes: any) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );

  const onConnect = useCallback(
    (params: any) =>
      setEdges((edgesSnapshot: any) => addEdge(params, edgesSnapshot)),
    []
  );

  // ✅ Save to Context only when user STOPS dragging
  const onNodeDragStop = useCallback(() => {
    setAddedNodes(nodes);
  }, [nodes, setAddedNodes]);

  // ✅ Save edges to Context when connection is made
  useEffect(() => {
    setNodeEdges(edges);
  }, [edges, setNodeEdges]);

  // Manual Save Function
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/agent/${agentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nodes,
          edges,
        }),
      });

      if (!res.ok) {
        // res.ok = false → !res.ok = true
        throw new Error("Failed to save");
      }

      toast.success("Workflow saved successfully!");
      console.log("✅ Workflow saved");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save workflow");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
      </div>
    );
  }

  return (
    <>
      <div>
        <Header />
        <div style={{ width: "100vw", height: "93vh" }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeDragStop={onNodeDragStop} // ✅ Save AFTER drag ends
            deleteKeyCode="Delete"
            fitView
            nodeTypes={nodeTypes}
          >
            <Controls />
            <MiniMap />
            {/* Use enum instead of string */}
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            <Panel position="top-left">
              <AgentToolsPanel />
            </Panel>
            <Panel position="top-right">Settings</Panel>
            <Panel position="bottom-center">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="cursor-pointer"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </>
                )}
              </Button>
            </Panel>
          </ReactFlow>
        </div>
      </div>
    </>
  );
};

export default AgentBuilder;
