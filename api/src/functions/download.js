import { app } from '@azure/functions';
import { BlobServiceClient } from "@azure/storage-blob";

app.http('download', {
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

            // 読み取るファイル名（必要ならクエリで変更可能）
            const blobName = "hello-from-swa.txt";
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);

            // Blob をダウンロード
            const downloadResponse = await blockBlobClient.download();
            const downloaded = await streamToString(downloadResponse.readableStreamBody);

            return {
                status: 200,
                body: downloaded
            };
        } catch (err) {
            return {
                status: 500,
                body: `Error: ${err.message}`
            };
        }
    }
});

// ストリーム → 文字列に変換
async function streamToString(readableStream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        readableStream.on("data", (data) => chunks.push(data.toString()));
        readableStream.on("end", () => resolve(chunks.join("")));
        readableStream.on("error", reject);
    });
}
