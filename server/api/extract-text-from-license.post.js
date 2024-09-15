import DocumentIntelligence from "@azure-rest/ai-document-intelligence";
import {
  getLongRunningPoller,
  isUnexpected,
} from "@azure-rest/ai-document-intelligence";
import { AzureKeyCredential } from "@azure/core-auth";

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    const key = config.azureAiDocumentIntelligence.apiKey;
    const endpoint = config.azureAiDocumentIntelligence.endpoint;

    const files = await readMultipartFormData(event);
    console.log(files);
    if (!files) {
      return { success: false, message: "File is invalid" };
    }

    const file = files[0].data;
    const base64Source = Buffer.from(file).toString("base64");
    // const query = getQuery(event);
    // const { document } = query;

    // const document = "./samples/license/1.jpeg"
    // const base64Source = fs.readFileSync(document, { encoding: "base64" });
    const client = DocumentIntelligence(endpoint, new AzureKeyCredential(key));

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

    return { success: true, message: analyzeResult.documents[0].fields };
  } catch (err) {
    console.log(err);
    return { success: false, message: "Error extracting text from license" };
  }
});
