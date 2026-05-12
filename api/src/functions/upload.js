import { app } from '@azure/functions';

app.http('upload', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async () => {
        return { status: 200, body: "upload function is alive!" };
    }
});