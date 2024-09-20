import { getDB } from "../db/index";

export default defineEventHandler(async () => {
  try {
    const db = await getDB();

    // Retrieve video details
    const videoDetails = await db.query`
      SELECT Id, Name, DurationInSeconds, ThumbnailId 
      FROM VideoAnalysisResults
    `;

    return {
      success: true,
      videos: videoDetails.recordset, // Assuming recordset contains the results
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: "Error fetching video data",
    };
  }
});
