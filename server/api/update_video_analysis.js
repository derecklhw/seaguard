import { BlobServiceClient } from "@azure/storage-blob";
import { useRuntimeConfig } from '#imports'; // Nuxt's way to import runtime config
import { readMultipartFormData } from 'h3';
import { PassThrough } from "stream";
import { getDB } from "../db/index";

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
    const form = await readMultipartFormData(event);
    const videoId = form.find(field => field.name === 'id').data.toString();
    const name = form.find(field => field.name === 'name').data.toString();
    const duration = parseFloat(form.find(field => field.name === 'duration').data.toString());

    let thumbnailUrl = null;

    // If a thumbnail file was uploaded, upload it to Blob Storage
    const thumbnailFile = form.find(field => field.name === 'thumbnail');
    if (thumbnailFile) {
      const fileBuffer = thumbnailFile.data;
      const fileName = `thumbnails/${videoId}-${thumbnailFile.filename}`;
      const mimeType = thumbnailFile.type;
      thumbnailUrl = await uploadThumbnailToBlob(containerClient, fileBuffer, fileName, mimeType);
    }

    const db = await getDB();

    // Update video details in the database
    await db.request()
      .input("Id", sql.NVarChar, videoId)
      .input("Name", sql.NVarChar, name)
      .input("DurationInSeconds", sql.Float, duration)
      .input("ThumbnailId", sql.NVarChar, thumbnailUrl || null)
      .query(`
        UPDATE VideoAnalysisResults 
        SET Name = @Name, DurationInSeconds = @DurationInSeconds, ThumbnailId = @ThumbnailId 
        WHERE Id = @Id
      `);

    return { success: true, message: "Video details updated successfully" };
  } catch (err) {
    console.error("Error updating video or uploading thumbnail:", err);
    return { success: false, message: "Error updating video or uploading thumbnail" };
  }
});
