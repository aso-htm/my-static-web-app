import { app } from '@azure/functions';
import { BlobServiceClient } from "@azure/storage-blob";

app.http('upload', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        try {
            const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

            if (!connectionString) {
                return { status: 500, body: "Connection string not set" };
            }

            const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
            const containerClient = blobServiceClient.getContainerClient("sample");

            const blobName = "hello-from-swa.txt";
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);

            const content = "Hello Blob from SWA!";
            const data = Buffer.from(content, "utf-8");

            await blockBlobClient.uploadData(data);

            return { status: 200, body: `Uploaded: ${blobName}` };
        } catch (err) {
            return { status: 500, body: `Error: ${err.message}` };
        }
    }
});
