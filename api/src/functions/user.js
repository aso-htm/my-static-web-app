const { app } = require('@azure/functions');

app.http('user', {
  route: 'users/{id}',   // ← ここがポイント！
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async (req, ctx) => {

    const id = req.params.id;

    const users = [
      { id: 1, name: "Taro", age: 25 },
      { id: 2, name: "Hanako", age: 30 },
      { id: 3, name: "Ken", age: 28 }
    ];

    const user = users.find(u => u.id == id);

    if (!user) {
      return { status: 404, body: "User not found" };
    }

    return { jsonBody: user };
  }
});
