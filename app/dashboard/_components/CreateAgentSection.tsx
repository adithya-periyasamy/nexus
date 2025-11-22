"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DialogClose } from "@radix-ui/react-dialog";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type Props = {};

const CreateAgentSection = (props: Props) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [agentName, setAgentName] = useState("");
  const [loading, setLoading] = useState(false);

  const createAgent = async () => {
    if (!agentName.trim()) {
      toast.error("Please enter an agent name");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/agent/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: agentName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create agent");
      }

      toast.success("Agent created successfully!");
      setOpen(false);
      setAgentName("");

      // Redirect to agent builder
      router.push(`/agent-builder/${data.agent.agentId}`);
      router.refresh(); // This will refresh server components!
    } catch (error: any) {
      console.error("Error creating agent:", error);
      toast.error(error.message || "Failed to create agent");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="space-y-2 flex flex-col justify-center items-center pt-24">
        <h2 className="text-2xl font-bold">Create Agent</h2>
        <p className="text-gray-500">
          Build an AI Agent workflow with custom logic and tools
        </p>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size={"lg"}>
              <Plus />
              Create
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enter Agent Name</DialogTitle>
              <DialogDescription>
                Give your AI agent a descriptive name
              </DialogDescription>
            </DialogHeader>

            <Input
              placeholder="Enter Agent Name"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading) {
                  createAgent();
                }
              }}
              disabled={loading}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" disabled={loading}>
                  Cancel
                </Button>
              </DialogClose>
              <Button onClick={createAgent} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Agent"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default CreateAgentSection;
