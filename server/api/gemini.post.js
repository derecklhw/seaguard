import { GoogleGenerativeAI } from "@google/generative-ai";
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { prompt, document } = body;

    const config = useRuntimeConfig();
    const genAI = new GoogleGenerativeAI(config.geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const finalPrompt = `${prompt} ${document}`;
    const result = await model.generateContent(finalPrompt);
    return { success: true, message: result.response.text() };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: "Error prompting",
    };
  }
});
