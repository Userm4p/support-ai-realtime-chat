import express from 'express';
import { connectRedis, envs } from './config';
import { router } from './routes';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: envs.frontendUrl,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }),
);

app.use('/api', router);

app.listen(envs.port, async () => {
  await connectRedis();

  console.log(`Server running on port: ${envs.port}`);
});

export { app };
