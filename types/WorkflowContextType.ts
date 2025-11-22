export interface WorkflowContextType {
  addedNodes: any[];
  setAddedNodes: (nodes: any[]) => void;
  nodeEdges: any[];
  setNodeEdges: (edges: any[]) => void;
  agentName: string;
  setAgentName: (name: string) => void;
  published: boolean;
  setPublished: (published: boolean) => void;
}
