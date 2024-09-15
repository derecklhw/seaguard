import { getDB } from "../db/index";

export default defineEventHandler(async (event) => {
  try {
    const db = await getDB();

    const body = await readBody(event);
    const { extractedText, type } = body;
    const titleParagraph = extractedText.paragraphs[0];

    const title =
      titleParagraph.role === "title"
        ? titleParagraph.content
        : "No title found";

    const content = extractedText.content;

    // TODO: check if insert query good

    const response = await db
      .request()
      .input("Title", sql.NVarChar, title)
      .input("Content", sql.NVarChar, content)
      .input("Type", sql.NVarChar, type)
      .input("UserId", sql.Int, 1)
      .query(
        "INSERT INTO Documents (Title, Content, Type, UserId) OUTPUT INSERTED.Id VALUES (@Title, @Content, @Type, @UserId)"
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
