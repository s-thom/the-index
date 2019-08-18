import "./env";
import db from "./database/db";
import app from "./app";

const SERVER_PORT = process.env.SERVER_PORT || "3000";
const port = parseInt(SERVER_PORT);

app.listen(port, () =>
  console.log(`Starting ExpressJS server on Port ${port}`)
);
export default app;
