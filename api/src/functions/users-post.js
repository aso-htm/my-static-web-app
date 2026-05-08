const { app } = require('@azure/functions');

let users = [
  { id: 1, name: "Taro", age: 25 },
  { id: 2, name: "Hanako", age: 30 },
  { id: 3, name: "Ken", age: 28 }
];

app.http('users-post', {
  route: 'users',
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: async (request, context) => {

    // ★★★ Functions v4 正しい JSON 読み取り方法 ★★★
    const body = await request.json();

    if (!body.name || !body.age) {
      return {
        status: 400,
        body: "name と age は必須です"
      };
    }

    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;

    const newUser = {
      id: newId,
      name: body.name,
      age: body.age
    };

    users.push(newUser);

    return {
      status: 201,
      jsonBody: newUser
    };
  }
});
