import './util/env';
import app from './app';

const SERVER_PORT = process.env.SERVER_PORT || '7000';
const port = parseInt(SERVER_PORT, 10);

app.listen(port, () => console.log(`Starting ExpressJS server on Port ${port}`));
export default app;
