import { getDB } from "../db/index";

export default defineEventHandler(async () => {
  try {
    const db = await getDB();

    const result = await db.query`SELECT COUNT(*) FROM users`;
    return { success: true, message: result };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: "Error fetching users",
    };
  }
});
