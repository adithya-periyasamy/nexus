import { geminiModel } from "@/config/GeminiAiModel";
import { NextRequest, NextResponse } from "next/server";

const PROMPT = `Analyze this workflow and generate agent configuration in JSON format.

IMPORTANT: If there's an IfElseNode in the workflow:
- Extract the condition from IfElseNode settings
- Create TWO agents: one for "if" branch, one for "else" branch
- Each agent should have different instructions based on their branch

Return ONLY JSON. No markdown. No explanations.

Format:
{
  "systemPrompt": "overall system instruction",
  "primaryAgentName": "main agent name",
  "ifElseCondition": "condition text from IfElseNode" or null,
  "agents": [
    {
      "id": "agent-id",
      "name": "agent name",
      "model": "gemini-2.0-flash-exp",
      "includeHistory": true,
      "instruction": "detailed instruction for this agent",
      "branch": "if" or "else" or null,
      "tools": ["tool-id-1"]
    }
  ],
  "tools": [
    {
      "id": "tool-id",
      "name": "tool_name",
      "description": "what this tool does",
      "method": "GET" or "POST",
      "url": "api endpoint with {param} placeholders",
      "includeApiKey": true or false,
      "apiKey": "key if available",
      "parameters": { "paramName": "string" or "number" }
    }
  ]
}`;

export async function POST(req: NextRequest) {
  try {
    const { jsonConfig } = await req.json();

    const result = await geminiModel.generateContent(
      `${PROMPT}\n\nWorkflow Config:\n${JSON.stringify(jsonConfig, null, 2)}`
    );

    const response = await result.response;
    const outputText = response.text();

    console.log("Gemini Output:", outputText);

    // Clean and parse JSON
    const cleanedText = outputText.replace(/```json\n?|\n?```/g, "").trim();

    const parsedJson = JSON.parse(cleanedText);

    return NextResponse.json(parsedJson);
  } catch (error: any) {
    console.error("Agent config generation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate config" },
      { status: 500 }
    );
  }
}
