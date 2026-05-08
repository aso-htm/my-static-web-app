const { app } = require('@azure/functions');

app.http('users', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async (req, ctx) => {

    // ダミーデータ（本来はDBから取得）
    const users = [
      { id: 1, name: "Taro", age: 25 },
      { id: 2, name: "Hanako", age: 30 },
      { id: 3, name: "Ken", age: 28 }
    ];

    return {
      jsonBody: users
    };
  }
});
