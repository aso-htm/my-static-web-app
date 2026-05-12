const { BlobServiceClient } = require("@azure/storage-blob");

module.exports = async function (context, req) {
    try {
        const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

        if (!connectionString) {
            throw new Error("AZURE_STORAGE_CONNECTION_STRING is not set.");
        }

        const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
        const containerClient = blobServiceClient.getContainerClient("sample");

        // アップロードするファイル名
        const blobName = "hello-from-swa.txt";
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        const content = "Hello Blob! This is from Static Web Apps Functions.";
        await blockBlobClient.upload(content, content.length);

        context.res = {
            status: 200,
            body: `Uploaded: ${blobName}`
        };
    } catch (err) {
        context.res = {
            status: 500,
            body: `Error: ${err.message}`
        };
    }
};
