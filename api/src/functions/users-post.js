import { app } from '@azure/functions';
import sql from "mssql";
import { v4 as uuidv4 } from "uuid";

app.http('users-post', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: async (request, context) => {

    const body = await request.json();
    const id = uuidv4();

    const config = {
      server: process.env.DB_SERVER,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      options: { encrypt: true }
    };

    const pool = await sql.connect(config);

    await pool.request()
      .input("id", id)
      .input("name", body.name)
      .input("age", body.age)
      .query("INSERT INTO Users (Id, Name, Age) VALUES (@id, @name, @age)");

    return {
      status: 201,
      jsonBody: { id, ...body }
    };
  }
});