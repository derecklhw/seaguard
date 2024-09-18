import { getDB } from "../db/index";
import sql from "mssql";

export default defineEventHandler(async (event) => {
  try {
    const db = await getDB();

    const body = await readBody(event);
    const { extractedText, type, userEmail } = body;
    const titleParagraph = extractedText.paragraphs
      ? extractedText.paragraphs[0]
      : null;
    let title = "No title found";
    if (titleParagraph) {
      title =
        titleParagraph.role === "title"
          ? titleParagraph.content
          : "No title found";
    }

    const content = extractedText.content;

    const response = await db
      .request()
      .input("Title", sql.NVarChar, title)
      .input("Content", sql.NVarChar, content)
      .input("Type", sql.NVarChar, type)
      .input("UserEmail", sql.NVarChar, userEmail)
      .query(
        "INSERT INTO Documents (Title, Content, Type, UserEmail) OUTPUT INSERTED.Id VALUES (@Title, @Content, @Type, @UserEmail)"
      );

    return { success: true, message: response.recordset[0] };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: "Error inserting document",
    };
  }
});
