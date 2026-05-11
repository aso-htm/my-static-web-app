const { app } = require('@azure/functions');
import sql from "mssql";

app.http('users', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async (request, context) => {

    const config = {
      server: process.env.DB_SERVER,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      options: { encrypt: true }
    };

    const pool = await sql.connect(config);
    const result = await pool.request().query("SELECT * FROM Users");

    return {
      status: 200,
      jsonBody: result.recordset
    };
  }
});