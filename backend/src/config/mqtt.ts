import mqtt from 'mqtt';
import { envs } from './envs';

const client = mqtt.connect(envs.mqtt.broker!);

client.on('connect', () => {
  console.log('[MQTT] Connected successfully to broker:', envs.mqtt.broker);
});

client.on('error', (err) => {
  console.error('[MQTT] Error trying to connect to broker:', err.message);
});

export { client as mqttClient };
