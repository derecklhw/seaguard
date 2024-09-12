import sql from "mssql";
import { GoogleGenerativeAI } from "@google/generative-ai";
const config = useRuntimeConfig();
const sqlConfig = {
  user: config.azureMySqlUser,
  password: config.azureMySqlPassword,
  server: config.azureMySqlServer,
  database: config.azureMySqlDatabase,
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
};

export default defineEventHandler(async (event) => {
  try {
    await sql.connect(sqlConfig);
    const result = await sql.query`SELECT * FROM users`;
    return result;
  } catch (err) {
    console.log(err);
  }
  // return { world: "hello" };
  // try {
  //   const genAI = new GoogleGenerativeAI(config.geminiApiKey);
  //   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  //   const finalPrompt = `hello`;
  //   const result = await model.generateContent(finalPrompt);
  //   return result.response.text();
  // } catch (err) {
  //   console.error("Error prompting:", err);
  //   throw err;
  // }
});
