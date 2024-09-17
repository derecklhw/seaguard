import { getDB } from "../db/index";

export default defineEventHandler(async () => {
  try {
    const db = await getDB();

    // First, get the count of videos
    const countResult = await db.query`SELECT COUNT(*) as count FROM VideoAnalysisResults`;

    // Then, retrieve the video details: Name, DurationInSeconds, and Id
    const videoDetails = await db.query`
      SELECT Id, Name, DurationInSeconds ,ThumbnailId 
      FROM VideoAnalysisResults
    `;

    return {
      success: true,
      count: countResult, // Assuming count is returned as the first element in the array
      videos: videoDetails, // This will return an array of objects with Id, Name, DurationInSeconds
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: "Error fetching video data",
    };
  }
});
