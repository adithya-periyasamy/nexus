import { genAI } from "@/config/GeminiAiModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { input, tools = [], agents = [], workflowConfig } = await req.json();

    if (!input?.trim() || !agents.length) {
      return NextResponse.json(
        { error: "Invalid input or agents" },
        { status: 400 }
      );
    }

    // 🎯 PROPERLY USE WORKFLOW CONFIG
    let finalInstructions =
      agents[0]?.instructions || "You are a helpful assistant.";

    if (workflowConfig?.flow && workflowConfig?.startNode) {
      console.log("📋 Processing workflow config...");

      // Build complete instruction from workflow
      let workflowInstructions = "";

      // 1. Find Start Node
      const startNode = workflowConfig.flow.find(
        (n: any) => n.id === workflowConfig.startNode
      );

      // 2. Find If/Else Node
      const ifElseNode = workflowConfig.flow.find(
        (n: any) => n.type === "IfElseNode"
      );

      // 3. Find Agent Nodes
      const agentNodes = workflowConfig.flow.filter(
        (n: any) => n.type === "AgentNode"
      );

      // 4. Find End Node
      const endNode = workflowConfig.flow.find(
        (n: any) => n.type === "EndNode"
      );

      // Build instruction from workflow structure
      if (ifElseNode) {
        const condition = ifElseNode.settings?.condition || "";

        // Check if input meets condition
        const inputLower = input.toLowerCase();
        const conditionLower = condition.toLowerCase();
        const meetsCondition = inputLower.includes(conditionLower);

        console.log(`🔍 Condition: "${condition}"`);
        console.log(`📝 Input: "${input}"`);
        console.log(`✓ Matches: ${meetsCondition}`);

        // Get target node based on condition
        const targetNodeId = meetsCondition
          ? ifElseNode.next?.if
          : ifElseNode.next?.else;

        if (targetNodeId) {
          const targetNode = workflowConfig.flow.find(
            (n: any) => n.id === targetNodeId
          );

          if (targetNode?.type === "AgentNode") {
            // Use agent's instructions from workflow
            const agentInstructions = targetNode.settings?.instructions || "";

            // Build complete instruction
            workflowInstructions = `
You are working within a workflow system. Here are your constraints:

CONDITION CHECK: "${condition}"
USER INPUT MATCHES: ${meetsCondition ? "YES (IF branch)" : "NO (ELSE branch)"}

YOUR ROLE AND INSTRUCTIONS:
${agentInstructions}

IMPORTANT RULES:
${
  meetsCondition
    ? `- The user's query is related to: ${condition}`
    : `- The user's query is NOT related to: ${condition}`
}
${
  endNode?.settings?.message
    ? `- After answering, end with: ${endNode.settings.message}`
    : ""
}

Follow these instructions strictly. If the user asks something outside your scope, politely redirect them.
            `.trim();

            finalInstructions = workflowInstructions;
            console.log(
              `✅ Using workflow instructions for: ${targetNode.label}`
            );
          }
        }
      }

      // If no If/Else, use first agent node
      if (!ifElseNode && agentNodes.length > 0) {
        const firstAgent = agentNodes[0];
        if (firstAgent.settings?.instructions) {
          finalInstructions = firstAgent.settings.instructions;
          console.log(`✅ Using first agent: ${firstAgent.label}`);
        }
      }
    }

    console.log(
      `📜 Final instructions: ${finalInstructions.substring(0, 100)}...`
    );

    // Prepare tools
    const toolMap = new Map();
    const functionDeclarations = tools
      .filter((t: any) => t?.name && t?.url)
      .map((t: any) => {
        const sanitizedName = t.name
          .replace(/[^a-zA-Z0-9_]/g, "_")
          .substring(0, 64);
        toolMap.set(sanitizedName, t);

        const properties: Record<string, any> = {};
        const required: string[] = [];

        if (t.parameters) {
          Object.entries(t.parameters).forEach(([key, type]) => {
            properties[key] = { type: type === "number" ? "number" : "string" };
            required.push(key);
          });
        }

        return {
          name: sanitizedName,
          description: t.description || `Tool: ${t.name}`,
          parameters: { type: "object" as const, properties, required },
        };
      });

    // 🔍 IMPROVED Web Search Tool - Make it clear when to use
    functionDeclarations.push({
      name: "web_search",
      description:
        "Search Google for current, real-time information like: current events, latest news, live weather, flight schedules, sports scores, stock prices, or any information that changes frequently. Use this when the user asks about 'today', 'now', 'current', 'latest', or recent events.",
      parameters: {
        type: "object" as const,
        properties: {
          query: {
            type: "string",
            description:
              "Search query - be specific and include relevant keywords like dates, locations, etc.",
          },
        },
        required: ["query"],
      },
    });

    // Create model with proper instructions
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: finalInstructions,
      ...(functionDeclarations.length && { tools: [{ functionDeclarations }] }),
    });

    const chat = model.startChat({ history: [] });

    // Stream response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let result = await chat.sendMessage(input);
          let response = result.response;

          // Handle tool calls
          for (let i = 0; i < 10; i++) {
            const calls = response.functionCalls?.() || [];
            if (!calls.length) break;

            const call = calls[0];

            // 🔍 IMPROVED: Better Google Custom Search handling
            if (call.name === "web_search") {
              try {
                const query = (call.args as any)?.query || "";
                console.log("🔍 Searching Google for:", query);

                const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
                const engineId = process.env.GOOGLE_SEARCH_ENGINE_ID;

                if (apiKey && engineId) {
                  // Use Google Custom Search with more parameters for better results
                  const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${engineId}&q=${encodeURIComponent(
                    query
                  )}&num=10`;

                  const searchRes = await fetch(searchUrl, {
                    signal: AbortSignal.timeout(10000),
                  });

                  if (!searchRes.ok) {
                    throw new Error(`Search API error: ${searchRes.status}`);
                  }

                  const searchData = await searchRes.json();

                  // Extract comprehensive results
                  const results =
                    searchData.items?.slice(0, 8).map((item: any) => ({
                      title: item.title,
                      snippet: item.snippet,
                      link: item.link,
                      displayLink: item.displayLink,
                    })) || [];

                  // Include answer if available
                  const directAnswer = searchData.items?.[0]?.snippet || null;

                  const responseData = {
                    query: query,
                    totalResults:
                      searchData.searchInformation?.totalResults || "0",
                    results: results,
                    topSnippet: directAnswer,
                    message:
                      results.length > 0
                        ? `Found ${results.length} results. Use this information to answer the user's question.`
                        : "No results found. Please inform the user you couldn't find current information on this topic.",
                  };

                  console.log(`✅ Found ${results.length} results`);

                  result = await chat.sendMessage([
                    {
                      functionResponse: {
                        name: call.name,
                        response: responseData,
                      },
                    },
                  ]);

                  response = result.response;
                  continue;
                } else {
                  // Better error handling
                  result = await chat.sendMessage([
                    {
                      functionResponse: {
                        name: call.name,
                        response: {
                          error: "Search not configured",
                          message:
                            "I cannot search for current information right now. Please provide the information or try asking in a different way. To enable search, add GOOGLE_SEARCH_API_KEY and GOOGLE_SEARCH_ENGINE_ID to environment variables.",
                        },
                      },
                    },
                  ]);
                  response = result.response;
                  continue;
                }
              } catch (error: any) {
                console.error("Search error:", error);
                result = await chat.sendMessage([
                  {
                    functionResponse: {
                      name: call.name,
                      response: {
                        error: error.message,
                        message:
                          "I encountered an error while searching. Please try rephrasing your question or provide more details.",
                      },
                    },
                  },
                ]);
                response = result.response;
                continue;
              }
            }

            // Handle custom tools
            const tool = toolMap.get(call.name);
            if (!tool) break;

            try {
              let url = tool.url;
              const params = (call.args as any) || {};

              Object.entries(params).forEach(([key, value]) => {
                if (value != null) {
                  const encoded = encodeURIComponent(String(value));
                  url = url
                    .replace(`{${key}}`, encoded)
                    .replace(`\${${key}}`, encoded);
                }
              });

              if (tool.includeApiKey && tool.apiKey) {
                url += `${url.includes("?") ? "&" : "?"}key=${tool.apiKey}`;
              }

              const apiRes = await fetch(url, {
                method: tool.method || "GET",
                headers: { "Content-Type": "application/json" },
                signal: AbortSignal.timeout(30000),
              });

              const data = apiRes.ok
                ? apiRes.headers.get("content-type")?.includes("json")
                  ? await apiRes.json()
                  : { result: await apiRes.text() }
                : { error: `HTTP ${apiRes.status}` };

              result = await chat.sendMessage([
                { functionResponse: { name: call.name, response: data } },
              ]);
              response = result.response;
            } catch (error: any) {
              result = await chat.sendMessage([
                {
                  functionResponse: {
                    name: call.name,
                    response: { error: error.message },
                  },
                },
              ]);
              response = result.response;
              break;
            }
          }

          // Stream final response
          const finalText = response.text() || "Unable to generate response";
          const words = finalText.split(" ");

          for (let i = 0; i < words.length; i++) {
            const word = words[i] + (i < words.length - 1 ? " " : "");
            controller.enqueue(encoder.encode(word));
            await new Promise((resolve) => setTimeout(resolve, 30));
          }

          controller.close();
        } catch (error: any) {
          console.error("Stream error:", error);
          controller.enqueue(
            encoder.encode("Error: " + (error.message || "Unknown error"))
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
