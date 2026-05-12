import { app } from '@azure/functions';
import { BlobServiceClient } from "@azure/storage-blob";

app.http('upload-image', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        try {
            const formData = await request.formData();
            const file = formData.get("file");

            if (!file) {
                return { status: 400, body: "file not found" };
            }

            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
            const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

            const containerName = "sample"; // 既存のコンテナ
            const containerClient = blobServiceClient.getContainerClient(containerName);

            // ファイル名をユニークにする
            const blobName = `${Date.now()}-${file.name}`;
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);

            await blockBlobClient.uploadData(buffer, {
                blobHTTPHeaders: { blobContentType: file.type }
            });

            // SAS URL を生成（1時間有効）
            const sasUrl = await generateSasUrl(blockBlobClient);

            return {
                status: 200,
                jsonBody: { url: sasUrl }
            };

        } catch (err) {
            return { status: 500, body: `Error: ${err.message}` };
        }
    }
});

// SAS URL を生成する関数
async function generateSasUrl(blockBlobClient) {
    const ONE_HOUR = 60;
    const expiresOn = new Date(new Date().valueOf() + ONE_HOUR * 60 * 1000);

    const sas = await blockBlobClient.generateSasUrl({
        expiresOn,
        permissions: "r" // 読み取りのみ
    });

    return sas;
}
