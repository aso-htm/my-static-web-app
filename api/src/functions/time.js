const { app } = require('@azure/functions');

app.http('time', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async (req, ctx) => {
    const now = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
    return { body: `現在時刻: ${now}` };
  }
});