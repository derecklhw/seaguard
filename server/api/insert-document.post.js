import { getDB } from "../db/index";

export default defineEventHandler(async (event) => {
  const db = await getDB();

  const body = await readBody(event);
  const { extractedText, type } = body;
  console.log(extractedText, type);
  try {
    const titleParagraph = extractedText.paragraphs[0];

    const title =
      titleParagraph.role === "title"
        ? titleParagraph.content
        : "No title found";

    const content = extractedText.content;

    const response = await db
      .request()
      .input("Title", sql.NVarChar, title)
      .input("Content", sql.NVarChar, content)
      .input("Type", sql.NVarChar, type)
      .input("UserId", sql.Int, 1)
      .query(
        "INSERT INTO Documents (Title, Content, Type, UserId) OUTPUT INSERTED.Id VALUES (@Title, @Content, @Type, @UserId)"
      );

    return response.recordset[0];
  } catch (err) {
    console.error("Error inserting document:", err);
    return {
      success: false,
      message: "Error inserting document",
    };
  }
});
