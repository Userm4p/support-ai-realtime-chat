import mqtt from 'mqtt';
import { envs } from './envs';

const client = mqtt.connect(envs.mqtt.broker!);

client.on('connect', () => {
  console.log('[MQTT] ✅ Conectado al broker MQTT');
});

client.on('error', (err) => {
  console.error('[MQTT] ❌ Error de conexión:', err.message);
});

export { client as mqttClient };
