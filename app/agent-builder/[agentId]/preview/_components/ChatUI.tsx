import { Button } from "@/components/ui/button";
import { AgentType } from "@/types/AgentType";
import { Loader2Icon, RefreshCcwIcon, Send } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

interface ChatUIProps {
  GenerateAgentToolConfig: () => void;
  loading: boolean;
  agentDetail: AgentType;
  conversationId: string;
  workflowConfig?: any; // property is optional.
}

const ChatUI = ({
  GenerateAgentToolConfig,
  loading,
  agentDetail,
  conversationId,
  workflowConfig,
}: ChatUIProps) => {
  const [userInput, setUserInput] = useState<string>("");
  const [loadingMsg, setLoadingMsg] = useState<boolean>(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  ); // array of objects

  const handleSendMessage = async () => {
    setLoadingMsg(true);
    setMessages((prev) => [...prev, { role: "user", content: userInput }]);
    setUserInput("");
    const res = await fetch("/api/agent-chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        agentName: agentDetail?.name,
        input: userInput,
        tools: agentDetail?.agentToolConfig?.tools || [],
        agents: agentDetail?.agentToolConfig?.agents || [],
        workflowConfig: workflowConfig || {},
        conversationId,
      }),
    });

    if (!res.ok) {
      toast.error("Failed to send message");
      return;
    }

    // displaying the streaming response

    const reader: any = res.body?.getReader();
    const decoder = new TextDecoder();
    let done = false;

    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;

      if (value) {
        console.log(decoder.decode(value));
        const chunk = decoder.decode(value);
        setMessages((prev) => {
          const updated = [...prev];

          updated[updated.length - 1] = {
            role: "assistant",
            content: (updated[updated.length - 1]?.content || "") + chunk,
          };

          return updated;
        });
      }
      setLoadingMsg(false);
    }
  };
  return (
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <div className="flex justify-between items-center border-b p-2 lg:p-3">
        <h2>{agentDetail?.name}</h2>
        <Button onClick={GenerateAgentToolConfig} disabled={loading}>
          <RefreshCcwIcon className={`${loading && "animate-spin"}`} /> Reboot
          Agent
        </Button>
      </div>

      <div className="w-full h-[85vh] p-3 flex flex-col">
        {/* Message Section */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-2 rounded-lg max-w-[80%] break-words ${
                message.role === "user"
                  ? "bg-blue-500 text-white self-end"
                  : "bg-gray-300 text-black self-start"
              } `}
            >
              <div className="text-sm break-works overflow-wrap-anywhere">
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
            </div>
          ))}

          {/* Loading state */}
          {loadingMsg && (
            <div className="flex justify-center items-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-zinc-800"></div>
              <span className="ml-2 text-zinc-800">
                Thinking... Working on your request
              </span>
            </div>
          )}
        </div>

        {/* Footer Input */}
        <div className="p-3 mt-3 border-t flex items-center gap-3">
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type your message here..."
            className="flex-1 resize-none border rounded-lg px-3 py-2 focus:outline-none focus:ring-2"
          />
          <Button
            onClick={handleSendMessage}
            disabled={loadingMsg || !userInput.trim().length}
          >
            {loadingMsg ? <Loader2Icon className="animate-spin" /> : <Send />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;
