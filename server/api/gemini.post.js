import { GoogleGenerativeAI } from "@google/generative-ai";
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();
  try {
    const genAI = new GoogleGenerativeAI(config.geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const finalPrompt = body.message;
    const result = await model.generateContent(finalPrompt);
    return result.response.text();
  } catch (err) {
    console.error("Error prompting:", err);
    throw err;
  }
});
