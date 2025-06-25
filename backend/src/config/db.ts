import { createClient } from 'redis';
import { PrismaClient } from '../generated/prisma';
import { envs } from './envs';

const redisClient = createClient({ url: envs.redis.url });

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log('Connected to Redis');
  } catch (error) {
    console.error('Error connecting to Redis:', error);
  }
};

const prisma = new PrismaClient();

export { prisma, connectRedis, redisClient };
