import { useRuntimeConfig } from '#imports'; // Nuxt's way to import runtime config
import { getDB } from "../db/index"; // Assuming you have a db connection helper
import sql from "mssql";
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
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
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

  if (!azureVideoIndexerAccessToken) {
    const azureADToken = await getAzureADToken(runtimeConfig);
    const response = await fetch(`https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.VideoIndexer/accounts/${accountName}/generateAccessToken?api-version=${apiVersion}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${azureADToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ permissionType: "Contributor", scope: "Account" }),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`Failed to generate Video Indexer access token: ${response.statusText} - ${errorDetails}`);
    }

    const responseData = await response.json();
    azureVideoIndexerAccessToken = responseData.accessToken;
  }

  return azureVideoIndexerAccessToken;
}

// Function to start video analysis using access token
async function startVideoAnalysis(videoUrl, runtimeConfig) {
  const accountId = runtimeConfig.azureVideoIndexer.accountId;
  const location = runtimeConfig.azureVideoIndexer.location;
  const accessToken = await generateVideoIndexerAccessToken(runtimeConfig);

  const videoIndexerApiUrl = new URL(`https://api.videoindexer.ai/${location}/Accounts/${accountId}/Videos`);
  videoIndexerApiUrl.searchParams.append("accessToken", accessToken);
  videoIndexerApiUrl.searchParams.append("videoUrl", videoUrl);
  videoIndexerApiUrl.searchParams.append("name", "VideoAnalysis");
  videoIndexerApiUrl.searchParams.append("privacy", "Public");
  const response = await fetch(videoIndexerApiUrl.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    throw new Error(`Error: ${response.statusText} - ${errorDetails}`);
  }

  const responseData = await response.json();
  return responseData.id;
}

// Poll for video analysis results
async function pollVideoAnalysis(videoId, runtimeConfig) {
  const accountId = runtimeConfig.azureVideoIndexer.accountId;
  const location = runtimeConfig.azureVideoIndexer.location;
  const accessToken = await generateVideoIndexerAccessToken(runtimeConfig);

  const videoIndexerApiUrl = new URL(`https://api.videoindexer.ai/${location}/Accounts/${accountId}/Videos/${videoId}/Index`);
  videoIndexerApiUrl.searchParams.append("accessToken", accessToken);
  videoIndexerApiUrl.searchParams.append("language", "en-US");

  let response, data;
  do {
    response = await fetch(videoIndexerApiUrl.toString(), { method: "GET" });

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`Error: ${response.statusText} - ${errorDetails}`);
    }

    data = await response.json();
    console.log("Current analysis state:", data);
    console.log("Current analysis state:", data.state);
    await new Promise((resolve) => setTimeout(resolve, 5000)); // Polling every 5 seconds
  } while (data.state !== "Processed" && data.state !== "Failed" && data.state !== "Canceled");

  if (data.state === "Failed" || data.state === "Canceled") {
    throw new Error(`Video analysis ${data.state.toLowerCase()}: ${data.failureReason || "Unknown reason"}`);
  }

  return data;
}

// API handler for starting video analysis
export default defineEventHandler(async (event) => {
    const runtimeConfig = useRuntimeConfig();
    const query = getQuery(event);
    const videoUrl = query.videoUrl;
  
    if (!videoUrl) {
      throw new Error("Missing video URL");
    }
  
    try {
      // Start the video analysis
      const videoId = await startVideoAnalysis(videoUrl, runtimeConfig);
      const analysisResults = await pollVideoAnalysis(videoId, runtimeConfig);
  
      // Prepare data for insertion into the database
      const videoAnalysisData = {
        Id: videoId,
        AccountId: analysisResults.accountId || null,
        Name: analysisResults.name || "Unnamed",
        Created: new Date(analysisResults.created),
        DurationInSeconds: analysisResults.durationInSeconds || 0,
      };
  
      const db = await getDB();
  
      // Insert into the database
      const response = await db
        .request()
        .input("Id", sql.NVarChar, videoAnalysisData.Id)
        .input("AccountId", sql.NVarChar, videoAnalysisData.AccountId)
        .input("Name", sql.NVarChar, videoAnalysisData.Name)
        .input("Created", sql.DateTimeOffset, videoAnalysisData.Created)
        .input("DurationInSeconds", sql.Float, videoAnalysisData.DurationInSeconds)
        .query(
          "INSERT INTO VideoAnalysisResults (Id, AccountId, Name, Created, DurationInSeconds) OUTPUT INSERTED.Id VALUES (@Id, @AccountId, @Name, @Created, @DurationInSeconds)"
        );
  
      console.log("Inserted data: ", response.recordset[0]);
  
      return { success: true, message: "Video analysis completed", analysisResults };
    } catch (error) {
      console.error("Error during video analysis or DB insertion: ", error);
      return { success: false, message: error.message };
    }
  });