import OpenAi from "openai";

export const openAi = new OpenAi({
  apiKey: process.env.OPENAI_API_KEY,
});

// import { GoogleGenerativeAI } from "@google/generative-ai";

// export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// export const geminiModel = genAI.getGenerativeModel({
//   model: "gemini-1.5-flash",
// });

//npm install @google/generative-ai
