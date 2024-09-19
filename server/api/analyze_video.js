import { useRuntimeConfig } from '#imports'; // Nuxt's way to import runtime config
import { getDB } from "../db/index"; // Assuming you have a db connection helper

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
    const videoId = await startVideoAnalysis(videoUrl, runtimeConfig);
    const analysisResults = await pollVideoAnalysis(videoId, runtimeConfig);

    // Insert analysis result into the database
    const db = await getDB();
    const summarizedInsights = JSON.stringify(analysisResults.summarizedInsights);
    const captions = JSON.stringify(analysisResults.captions || {});
    await db.query(
      `INSERT INTO VideoAnalysisResults (Id, AccountId, Name, Created, DurationInSeconds, SummarizedInsights, Captions)
       VALUES (${videoId}, ${analysisResults.accountId}, ${analysisResults.name}, ${new Date(analysisResults.created)}, 
               ${analysisResults.durationInSeconds}, ${summarizedInsights}, ${captions})`
    );

    return { success: true, message: "Video analysis completed", analysisResults };
  } catch (error) {
    return { success: false, message: error.message };
  }
});
