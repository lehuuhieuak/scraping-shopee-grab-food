import dotenv from 'dotenv';
import express, { Express } from 'express';

import { route } from './routes';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// for parsing application/json
app.use(express.json());

route(app);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
