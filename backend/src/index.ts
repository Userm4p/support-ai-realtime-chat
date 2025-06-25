import express from 'express';
import { connectRedis, envs } from './config';
import { router } from './routes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

app.listen(envs.port, async () => {
  await connectRedis();
  console.log(`Server is running on port ${envs.port}`);
});
