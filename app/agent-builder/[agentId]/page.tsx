"use client";
import { Button } from "@/components/ui/button";
import { WorkflowContext } from "@/context/WorkflowContext";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  BackgroundVariant,
  Controls,
  Edge,
  MiniMap,
  Node,
  Panel,
  ReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Loader2, Save } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import AgentToolsPanel from "../_components/AgentToolsPanel";
import Header from "../_components/Header";
import SettingPanel from "../_components/SettingPanel";
import AgentNode from "../_customNodes/AgentNode";
import ApiNode from "../_customNodes/ApiNode";
import EndNode from "../_customNodes/EndNode";
import IfElseNode from "../_customNodes/IfElseNode";
import StartNode from "../_customNodes/StartNode";
import UserApprovalNode from "../_customNodes/UserApprovalNode";
import WhileNode from "../_customNodes/WhileNode";

export const nodeTypes = {
  StartNode,
  AgentNode,
  EndNode,
  IfElseNode,
  WhileNode,
  UserApprovalNode,
  ApiNode,
};

const AgentBuilder = () => {
  const params = useParams();
  const agentId = params.agentId as string;

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [agentName, setAgentName] = useState("");

  const { addedNodes, setAddedNodes, setNodeEdges, setSelectedNode } =
    useContext(WorkflowContext);

  // ========== FETCH DATA ==========
  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const res = await fetch(`/api/agent/${agentId}`);
        if (!res.ok) return;

        const data = await res.json();
        const fetchedNodes = data.nodes || [];
        const fetchedEdges = data.edges || [];

        setAgentName(data.name);
        setNodes(fetchedNodes);
        setEdges(fetchedEdges);
        setAddedNodes(fetchedNodes);
        setNodeEdges(fetchedEdges);
        setSelectedNode(null);
      } catch (error) {
        console.error("Failed to fetch agent:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgent();
  }, [agentId]);

  // ==== SYNC: Context → Local (One-way) =====
  useEffect(() => {
    // Only sync when new node added OR settings updated
    if (addedNodes.length !== nodes.length) {
      // Length changed = node added/deleted elsewhere
      setNodes(addedNodes);
    } else if (addedNodes.length > 0 && nodes.length > 0) {
      // Same length = check if data changed (settings update)
      // Simple comparison using just IDs and a hash of data
      const context = addedNodes
        .map((n: any) => `${n.id}:${JSON.stringify(n.data.settings || {})}`)
        .join("|");
      const local = nodes
        .map((n) => `${n.id}:${JSON.stringify(n.data.settings || {})}`)
        .join("|");

      if (context !== local) {
        setNodes(addedNodes);
      }
    }
  }, [addedNodes]);

  // ==== REACTFLOW HANDLERS ====

  // dragging, renaming, resizing, selecting, etc.
  const onNodesChange = useCallback((changes: any) => {
    setNodes((prev) => applyNodeChanges(changes, prev));
  }, []);

  const onEdgesChange = useCallback((changes: any) => {
    setEdges((prev) => applyEdgeChanges(changes, prev));
  }, []);

  const onConnect = useCallback(
    (params: any) => {
      setEdges((prev) => {
        const newEdges = addEdge(params, prev);
        // Sync to context after state updates
        setTimeout(() => setNodeEdges(newEdges), 0);
        return newEdges;
      });
    },
    [setNodeEdges]
  );

  const onNodeClick = useCallback(
    (_event: any, node: Node) => {
      console.log("Node clicked:", node.id); // Debug log
      setSelectedNode(node);
    },
    [setSelectedNode]
  );

  const onPaneClick = useCallback(() => {
    console.log("Pane clicked - deselecting"); // Debug log
    setSelectedNode(null);
  }, [setSelectedNode]);

  // Keep onNodeDragStop for syncing position changes
  const onNodeDragStop = useCallback(() => {
    // Sync positions to context after drag
    setNodes((current) => {
      setAddedNodes(current);
      return current;
    });
  }, [setAddedNodes]);

  const onNodesDelete = useCallback(() => {
    // Sync after deletion completes
    setTimeout(() => {
      setNodes((current) => {
        setAddedNodes(current);
        return current;
      });
    }, 0);
  }, [setAddedNodes]);

  const onEdgesDelete = useCallback(() => {
    setTimeout(() => {
      setEdges((current) => {
        setNodeEdges(current);
        return current;
      });
    }, 0);
  }, [setNodeEdges]);

  // ==== SAVE TO DATABASE ====
  const handleSave = async () => {
    setSaving(true);
    try {
      // Use current state directly - React 18 guarantees it's flushed
      const res = await fetch(`/api/agent/${agentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nodes, edges }),
      });

      if (!res.ok) throw new Error("Failed to save");

      // Sync to context after successful save
      setAddedNodes(nodes);
      setNodeEdges(edges);

      toast.success("Workflow saved successfully!");
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
    <div>
      <Header agentName={agentName} agentId={agentId} isPreview={false} />
      <div style={{ width: "100vw", height: "93vh" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick} // ✅ Use this instead of onSelectionChange
          onPaneClick={onPaneClick} // ✅ Deselect when clicking canvas
          onNodeDragStop={onNodeDragStop}
          onNodesDelete={onNodesDelete}
          onEdgesDelete={onEdgesDelete}
          deleteKeyCode="Delete"
          fitView
          nodeTypes={nodeTypes} // // ← Maps "AgentNode" to AgentNode component
        >
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          <Panel position="top-left">
            <AgentToolsPanel />
          </Panel>
          <Panel position="top-right">
            <SettingPanel />
          </Panel>
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
  );
};

export default AgentBuilder;

/* 
Exact fixes (copy-paste these into your file)
1) Add refs near the top (after your useState declarations)
import { useRef } from "react"; // (already imported useCallback etc in your file)

const nodesRef = useRef<Node[]>([]);
const edgesRef = useRef<Edge[]>([]);

// keep refs in sync with state
useEffect(() => { nodesRef.current = nodes; }, [nodes]);
useEffect(() => { edgesRef.current = edges; }, [edges]);


These refs let you read the latest nodes/edges without relying on setTimeout or calling state setters inside other setters.

2) Replace onConnect with this (functional updater + immediate sync)
const onConnect = useCallback(
  (params: any) => {
    setEdges(prev => {
      const newEdges = addEdge(params, prev);
      setNodeEdges(newEdges); // safe here — you're using newEdges computed from prev
      return newEdges;
    });
  },
  [setNodeEdges]
);


This removes the setTimeout hack and avoids stale-closure bugs.

3) Replace onNodeDragStop (no nested setter — use ref)
const onNodeDragStop = useCallback(() => {
  setIsDragging(false);
  // read latest nodes from ref (guaranteed up-to-date after onNodesChange)
  setAddedNodes(nodesRef.current);
}, [setAddedNodes]);


This is safe and avoids the forbidden pattern.

4) Replace delete handlers with ref-based sync (no setTimeout, no nested setters)
const onNodesDelete = useCallback((deleted: Node[]) => {
  setAddedNodes(nodesRef.current);
}, [setAddedNodes]);

const onEdgesDelete = useCallback((deleted: Edge[]) => {
  setNodeEdges(edgesRef.current);
}, [setNodeEdges]);

*/
