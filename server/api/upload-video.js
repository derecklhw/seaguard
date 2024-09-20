import { BlobServiceClient } from "@azure/storage-blob";
import { useRuntimeConfig } from '#imports'; // Nuxt's way to import runtime config
import { readMultipartFormData } from 'h3'; // For handling multipart forms
import { PassThrough } from "stream";

// Set up Azure Video Indexer Access Token storage
let azureVideoIndexerAccessToken = null;

// Function to get Azure AD token using runtime config
async function getAzureADToken(runtimeConfig) {
  const tenantId = runtimeConfig.azure.tenantId;
  const clientId = runtimeConfig.azure.clientId;
  const clientSecret = runtimeConfig.azure.clientSecret;
  const scope = "https://management.azure.com/.default";

  const tokenEndpoint = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
      scope: scope,
    }),
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    throw new Error(`Failed to get Azure AD token: ${response.statusText} - ${errorDetails}`);
  }

  const responseData = await response.json();
  return responseData.access_token;
}

// Function to generate Azure Video Indexer access token
async function generateVideoIndexerAccessToken(runtimeConfig) {
  const subscriptionId = runtimeConfig.azure.subscriptionId;
  const resourceGroupName = runtimeConfig.azure.resourceGroup;
  const accountName = runtimeConfig.azure.videoIndexerAccountName;
  const apiVersion = '2024-01-01';

  const azureADToken = await getAzureADToken(runtimeConfig);

  const response = await fetch(`https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.VideoIndexer/accounts/${accountName}/generateAccessToken?api-version=${apiVersion}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${azureADToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      permissionType: "Contributor",
      scope: "Account"
    }),
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    throw new Error(`Failed to generate Video Indexer access token: ${response.statusText} - ${errorDetails}`);
  }

  const responseData = await response.json();
  azureVideoIndexerAccessToken = responseData.accessToken;
  return azureVideoIndexerAccessToken;
}

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
