import { getDB } from "../db/index";
import sql from "mssql";

export default defineEventHandler(async (event) => {
  try {
    const db = await getDB();

    const body = await readBody(event);
    const { summary, date, title } = body;

    const epochDate = new Date(date).getTime() / 1000;

    const response = await db
      .request()
      .input("Title", sql.NVarChar, title)
      .input("Description", sql.NVarChar, summary)
      .input("Timestamp", sql.Int, epochDate)
      .input("Status", sql.NVarChar, "Pending")
      .query(
        "INSERT INTO Incidents (Title, Description, Timestamp, Status) OUTPUT INSERTED.Id VALUES (@Title, @Description, @Timestamp, @Status)"
      );

    return { success: true, message: response.recordset[0] };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: "Error inserting incident",
    };
  }
});
