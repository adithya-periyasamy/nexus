"use client";

import { createContext } from "react";

export const WorkflowContext = createContext<any>(null);

// Purpose:   Creates a "global storage box" for your workflow data

// Why needed:

// Multiple components need to access the same nodes/edges
// AgentToolsPanel adds nodes → AgentBuilder displays them
// Without Context, you'd need to pass data through 5+ component levels (prop drilling hell!)
