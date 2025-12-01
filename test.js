import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyB_ooxvb7UptRWTpOpkYqYAyftHDvoMSwE");

async function test() {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });
    const result = await model.generateContent("Say hello");
    const response = await result.response;
    console.log("✅ Gemini works:", response.text());
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

test();
