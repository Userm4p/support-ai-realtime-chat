import dotenv from 'dotenv';

dotenv.config();

export const envs = {
  port: process.env.PORT || 3000,
  mqtt: {
    host: process.env.MQTT_HOST,
    port: process.env.MQTT_PORT,
    topic: process.env.MQTT_TOPIC,
  },
  redis: {
    url: process.env.REDIS_URL,
  },
  postgres: {
    databaseUrl: process.env.DATABASE_URL,
  },
};
