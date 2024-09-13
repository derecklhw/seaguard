import { getDB } from "../db/index";

export default defineEventHandler(async (event) => {
  try {
    const db = await getDB();
    const result = await db.query`SELECT * FROM users`;
    return result;
  } catch (err) {
    console.log(err);
  }
});
