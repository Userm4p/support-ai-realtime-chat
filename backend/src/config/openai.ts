import OpenAI from 'openai';
import { envs } from './envs';

const openai = new OpenAI({
  baseURL: envs.openai.baseUrl,
  apiKey: envs.openai.apiKey,
});

export { openai as openaiClient };
