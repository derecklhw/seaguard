import DocumentIntelligence, {
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
    if (!files) {
      return { success: false, message: "File is invalid" };
    }

    const file = files[0].data;
    const isPhotoTaken = Buffer.from(files[1].data).toString();
    let base64Source;
    if (isPhotoTaken === "true") {
      const image_data_url = Buffer.from(file).toString();
      base64Source = image_data_url.replace(/^data:image\/\w+;base64,/, "");
    } else {
      base64Source = Buffer.from(file).toString("base64");
    }

    const client = DocumentIntelligence(endpoint, new AzureKeyCredential(key));

    const initialResponse = await client
      .path(
        "/documentModels/{modelId}:analyze",
        Buffer.from(files[2].data).toString()
      )
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

    return { success: true, message: analyzeResult };
  } catch (err) {
    console.log(err);
    return { success: false, message: "Error extracting text from document" };
  }
});
