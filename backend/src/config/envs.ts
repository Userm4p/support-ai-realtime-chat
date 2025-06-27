import dotenv from 'dotenv';

dotenv.config();

export const envs = {
  port: process.env.PORT || 3000,
  mqtt: {
    broker: process.env.MQTT_BROKER,
  },
  redis: {
    url: process.env.REDIS_URL,
  },
  postgres: {
    databaseUrl: process.env.DATABASE_URL,
  },
  openai: {
    apiKey: process.env.OPEN_ROUTER_API_KEY,
    baseUrl: process.env.OPEN_ROUTER_BASE_URL,
    model: process.env.OPEN_ROUTER_MODEL,
  },
  frontendUrl: process.env.FRONTEND_URL,
};
