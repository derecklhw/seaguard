import { BlobServiceClient } from "@azure/storage-blob";
import { useRuntimeConfig } from '#imports'; // Nuxt's way to import runtime config
import { readMultipartFormData } from 'h3'; // For handling multipart forms
import { PassThrough } from "stream";


// Function to upload the video file from memory to Azure Blob Storage
async function uploadFileToBlob(containerClient, fileBuffer, fileName, mimeType) {
  const blockBlobClient = containerClient.getBlockBlobClient(fileName);

  const readStream = new PassThrough();
  readStream.end(fileBuffer);

  await blockBlobClient.uploadStream(readStream, fileBuffer.length, undefined, {
    blobHTTPHeaders: {
      blobContentType: mimeType,
    },
  });

  return blockBlobClient.url;
}

// Main API handler for video upload
export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  
  const containerName = "digicupvideostorage";
  const blobServiceClient = BlobServiceClient.fromConnectionString(runtimeConfig.azureStorage.connectionString);
  const containerClient = blobServiceClient.getContainerClient(containerName);

  try {
    const form = await readMultipartFormData(event);
    const file = form.find(field => field.name === 'video');
    const title = form.find(field => field.name === 'title').data.toString();

    if (!file) {
      return { success: false, message: "No video file uploaded." };
    }

    const fileBuffer = file.data;
    const fileName = file.filename;
    const mimeType = file.type;

    // Upload file to Azure Blob Storage directly from memory
    const blobUrl = await uploadFileToBlob(containerClient, fileBuffer, fileName, mimeType);

    // You can start video analysis or store the uploaded video information in the database here

    return {
      success: true,
      message: "Video uploaded successfully",
      videoUrl: blobUrl,
    };
  } catch (err) {
    console.error("Error uploading video:", err);
    return { success: false, message: "Error uploading video" };
  }
});
