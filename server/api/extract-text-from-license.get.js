import DocumentIntelligence from "@azure-rest/ai-document-intelligence";
import {
  getLongRunningPoller,
  isUnexpected,
} from "@azure-rest/ai-document-intelligence";
import { AzureKeyCredential } from "@azure/core-auth";
import fs from "fs";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const key = config.azureAiDocumentIntelligence.apiKey;
  const endpoint = config.azureAiDocumentIntelligence.endpoint;
  const query = getQuery(event);
  const { document } = query;
  try {
    const base64Source = fs.readFileSync(document, { encoding: "base64" });
    try {
      const client = DocumentIntelligence(
        endpoint,
        new AzureKeyCredential(key)
      );

      const initialResponse = await client
        .path("/documentModels/{modelId}:analyze", "MruBoatLicenseModel")
        .post({
          contentType: "application/json",
          body: {
            base64Source,
          },
        });

      if (isUnexpected(initialResponse)) {
        throw initialResponse.body.error;
      }

      const poller = await getLongRunningPoller(client, initialResponse);
      const analyzeResult = (await poller.pollUntilDone()).body.analyzeResult;

      return analyzeResult.document[0].fields;
    } catch (error) {
      console.log("Error:", error);
      throw error;
    }
  } catch (err) {
    return { error: "Error extracting text from license" };
  }
});
