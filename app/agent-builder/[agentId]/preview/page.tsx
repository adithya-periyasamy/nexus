"use client";

import { Button } from "@/components/ui/button";
import { AgentType } from "@/types/AgentType";
import { Background, BackgroundVariant, ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import axios from "axios";
import { Loader2, RefreshCcwIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Header from "../../_components/Header";
import { nodeTypes } from "../page";
import ChatUI from "./_components/ChatUI";

interface Config {
  startNode: string | null;
  flow: any;
}

const PreviewAgent = () => {
  const params = useParams();
  const agentId = params.agentId as string;

  const [loading, setLoading] = useState<boolean>(true);
  const [loading1, setLoading1] = useState<boolean>(false);
  const [conversationId, setConversationId] = useState<string>("");
  const [config, setConfig] = useState<any>();
  const [data, setData] = useState<AgentType>({
    agentId: "",
    name: "",
    config: {},
    published: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "",
    nodes: [],
    edges: [],
    agentToolConfig: {},
  });

  // ========== FETCH DATA ==========
  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const res = await fetch(`/api/agent/${agentId}`);
        if (!res.ok) return;

        const data = await res.json();
        console.log(data);
        setData(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch agent:", error);
      } finally {
        setLoading(false);
      }
    };

    // const fetchConversationId = async () => {
    //   try {
    //     const res = await fetch("/api/agent-chat", { method: "GET" });
    //     if (res.ok) {
    //       const data = await res.json();
    //       setConversationId(data.conversationId);
    //       console.log("Conversation ID:", data.conversationId);
    //     }
    //   } catch (error) {
    //     console.error("Failed to fetch conversation ID:", error);
    //   }
    // };

    fetchAgent();
    //fetchConversationId();
  }, [agentId]);

  // 🌿 Generate workflow once agent data is loaded
  useEffect(() => {
    if (data) {
      GenerateWorkFlow();
    }
  }, [data]);

  // 🔧 Generate workflow config (node/edge relationship)

  // first fn is to find the edges of a node
  // second is to find the target of a node

  const GenerateWorkFlow = () => {
    // 🌿 Build Edge Map for quick source -> target lookup(get all outgoing edges from a node)
    const edgeMap = data?.edges?.reduce((acc: any, edge: any) => {
      if (!acc[edge.source]) acc[edge.source] = [];
      acc[edge.source].push(edge);
      return acc;
    }, {}); // acc - stores the res, edge - each edge, {} - initial value

    // 🧩 Build flow array by mapping each node (“Return each node with its next node(s)”)
    const flow = data?.nodes?.map((node: any) => {
      const connectedEdges = edgeMap[node.id] || [];
      let next: any = null;

      switch (node.type) {
        // 🌿 Conditional branching node with "if" and "else"
        case "IfElseNode": {
          const ifEdge = connectedEdges.find(
            (e: any) => e.sourceHandle === "if"
          );
          const elseEdge = connectedEdges.find(
            (e: any) => e.sourceHandle === "else"
          );

          next = {
            if: ifEdge?.target || null,
            else: elseEdge?.target || null,
          };
          break;
        }

        // 🤖 Agent or AI Node
        case "AgentNode": {
          if (connectedEdges.length === 1) {
            next = connectedEdges[0].target;
          } else if (connectedEdges.length > 1) {
            next = connectedEdges.map((e: any) => e.target);
          }
          break;
        }

        // 🔗 API Call Node
        case "ApiNode": {
          if (connectedEdges.length === 1) {
            next = connectedEdges[0].target;
          }
          break;
        }

        // ☑️ User Approval Node (manual checkpoint)
        case "UserApprovalNode": {
          if (connectedEdges.length === 1) {
            next = connectedEdges[0].target;
          }
          break;
        }

        // 💖 Start Node
        case "StartNode": {
          if (connectedEdges.length === 1) {
            next = connectedEdges[0].target;
          }
          break;
        }

        // 🏁 End Node
        case "EndNode": {
          next = null; // No next node
          break;
        }

        // 🧩 Default handling for any unknown node type
        default: {
          if (connectedEdges.length === 1) {
            next = connectedEdges[0].target;
          } else if (connectedEdges.length > 1) {
            next = connectedEdges.map((e: any) => e.target);
          }
          break;
        }
      }

      // 📦 Return a simplified node configuration
      return {
        id: node.id,
        type: node.type,
        label: node.data?.label || node.type,
        settings: node.data?.settings || {},
        next,
      };
    });

    // 🎯 Find the Start Node
    const startNode = data?.nodes?.find((n: any) => n.type === "StartNode");

    // 🏗️ Final Config structure (create a config object)
    //config is a obj with startNode as key and id as value and a flow obj inside it
    const config: Config = {
      startNode: startNode?.id || null,
      flow,
    };

    console.log("🟢 Generated Workflow Config:", JSON.stringify(config));
    setConfig(config);
  };

  const GenerateAgentToolConfig = async () => {
    setLoading1(true);
    try {
      // Step 1: Generate the config using AI
      const result = await axios.post("/api/agent-config", {
        jsonConfig: config,
      });

      console.log("🟡 Generated Agent Tool Config:", result.data);

      // Step 2: Save it to the database
      const updateResult = await axios.put(
        `/api/agent/${agentId}/update-config`,
        {
          agentToolConfig: result.data,
        }
      );

      if (updateResult.data.success) {
        toast.success("Agent configuration saved!");

        // Update local state
        setData((prev) => ({
          ...prev,
          agentToolConfig: result.data,
        }));
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast.error("Failed to generate or save config");
    } finally {
      setLoading1(false);
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
      <div>
        <Header agentName={data.name} agentId={agentId} isPreview={true} />
      </div>
      {/* Responsive grid: stack on mobile, side-by-side on lg+ */}
      <div className="flex flex-col lg:grid lg:grid-cols-4 gap-2 lg:gap-0">
        {/* Flow Preview - full width on mobile, 3/4 on desktop */}
        <div className="lg:col-span-3 border rounded-2xl m-3 lg:m-5 order-2 lg:order-1">
          <h2 className="p-2 font-bold">Preview</h2>
          <div className="w-full h-[50vh] lg:h-[93vh]">
            <ReactFlow
              nodes={data?.nodes || []}
              edges={data?.edges || []}
              fitView
              nodeTypes={nodeTypes}
            >
              <Background variant={BackgroundVariant.Dots} gap={12} />
            </ReactFlow>
          </div>
        </div>
        {/* Chat UI - full width on mobile, 1/4 on desktop */}
        <div className="lg:col-span-1 rounded-2xl m-3 lg:m-5 p-3 border min-h-[40vh] lg:min-h-0 order-1 lg:order-2">
          <div className="flex items-center justify-center h-full">
            {!data?.agentToolConfig ? (
              <Button
                className="cursor-pointer"
                onClick={GenerateAgentToolConfig}
                disabled={loading1}
              >
                <RefreshCcwIcon
                  className={`${loading1 ? "animate-spin" : ""}`}
                />
                Reboot Agent
              </Button>
            ) : (
              <ChatUI
                GenerateAgentToolConfig={GenerateAgentToolConfig}
                loading={loading1}
                agentDetail={data}
                conversationId={conversationId}
                workflowConfig={config}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewAgent;
