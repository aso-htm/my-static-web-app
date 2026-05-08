const { app } = require('@azure/functions');

app.http('weather', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async (req, ctx) => {
    return {
      jsonBody: {
        location: "札幌市",
        temperature: -2,
        condition: "雪"
      }
    };
  }
});