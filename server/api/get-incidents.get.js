import { getDB } from "../db/index";

export default defineEventHandler(async () => {
  try {
    const db = await getDB();

    const result =
      // TODO: add parameter to choose to return all incidents in timestamp order
      await db.query`SELECT * FROM incidents ORDER BY Timestamp ASC`;
    return { success: true, message: result };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: "Error fetching incidents",
    };
  }
});
