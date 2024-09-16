// server/plugins/connectDb.js
import { connectDB } from "../db/index.js";

export default defineNitroPlugin(async () => {
  await connectDB();
});
