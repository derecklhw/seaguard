import { getDB } from "../db/index";

export default defineEventHandler(async (event) => {
  try {
    const db = await getDB();
    // create a request object to inject data
    // const request = await db.request();
    const result = await db.query`SELECT * FROM users`;
    return result;
  } catch (err) {
    console.log(err);
  }
});
