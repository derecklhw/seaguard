import { BlobServiceClient } from "@azure/storage-blob";
import { useRuntimeConfig } from '#imports'; // Nuxt's way to import runtime config
import { readMultipartFormData } from 'h3';
import { PassThrough } from "stream";
import { getDB } from "../db/index";
import sql from "mssql";

// Function to upload the thumbnail to Azure Blob Storage
async function uploadThumbnailToBlob(containerClient, fileBuffer, fileName, mimeType) {
  const blockBlobClient = containerClient.getBlockBlobClient(fileName);
  const readStream = new PassThrough();
  readStream.end(fileBuffer);

  await blockBlobClient.uploadStream(readStream, fileBuffer.length, undefined, {
    blobHTTPHeaders: { blobContentType: mimeType },
  });

  return blockBlobClient.url;
}

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  const containerName = "thumbnailrepo"; // The container for thumbnail uploads
  const blobServiceClient = BlobServiceClient.fromConnectionString(runtimeConfig.azureStorage.connectionString);
  const containerClient = blobServiceClient.getContainerClient(containerName);

  try {
    // Log the start of the process
    console.log("Processing form data and starting upload...");

    const form = await readMultipartFormData(event);
    if (!form) {
      console.error("No form data received");
      return { success: false, message: "No form data received" };
    }

    // Extract data from form fields
    const videoId = form.find(field => field.name === 'id')?.data?.toString();
    const name = form.find(field => field.name === 'name')?.data?.toString();
    const durationField = form.find(field => field.name === 'duration');
    const duration = durationField ? parseFloat(durationField.data.toString()) : null;

    if (!videoId || !name || !duration) {
      console.error("Missing required video data", { videoId, name, duration });
      return { success: false, message: "Missing required video data" };
    }

    console.log("Received video data:", { videoId, name, duration });

    let thumbnailUrl = null;

    // If a thumbnail file was uploaded, upload it to Blob Storage
    const thumbnailFile = form.find(field => field.name === 'thumbnail');
    if (thumbnailFile) {
      const fileBuffer = thumbnailFile.data;
      const fileName = `thumbnails/${videoId}-${thumbnailFile.filename}`;
      const mimeType = thumbnailFile.type;
      thumbnailUrl = await uploadThumbnailToBlob(containerClient, fileBuffer, fileName, mimeType);
      console.log("Thumbnail uploaded successfully to:", thumbnailUrl);
    }

    // Proceed with database update
    const db = await getDB();

    console.log("Updating video in the database...");

    const updateQuery = `
      UPDATE VideoAnalysisResults 
      SET Name = @Name, DurationInSeconds = @DurationInSeconds, ThumbnailId = @ThumbnailId 
      WHERE Id = @Id
    `;

    const dbResponse = await db.request()
      .input("Id", sql.NVarChar, videoId)
      .input("Name", sql.NVarChar, name)
      .input("DurationInSeconds", sql.Float, duration)
      .input("ThumbnailId", sql.NVarChar, thumbnailUrl || null)
      .query(updateQuery);

    console.log("Database update result:", dbResponse);

    return { success: true, message: "Video details updated successfully" };

  } catch (err) {
    console.error("Error during video update or thumbnail upload:", err);
    return { success: false, message: "Error updating video or uploading thumbnail", error: err.message };
  }
});
