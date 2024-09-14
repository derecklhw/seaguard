import { GoogleGenerativeAI } from "@google/generative-ai";
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { prompt, document } = body;

  const config = useRuntimeConfig();
  try {
    const genAI = new GoogleGenerativeAI(config.geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const finalPrompt = `${prompt} ${document}`;
    const result = await model.generateContent(finalPrompt);
    return result.response.text();
  } catch (err) {
    console.error("Error prompting:", err);
    throw err;
  }
});
