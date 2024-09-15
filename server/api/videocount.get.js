import { getDB } from "../db/index";

export default defineEventHandler(async (event) => {
  try {
    const db = await getDB();

    const result = await db.query`SELECT COUNT(*) FROM VideoAnalysisResults`;
    return { success: true, message: result };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: "Error fetching users",
    };
  }
});
