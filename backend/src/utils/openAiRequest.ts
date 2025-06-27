import { envs, openaiClient } from '../config';

export const openAiRequest = async (message: string): Promise<string> => {
  const prompt = `You are a helpful support assistant. Respond to the following message:\n\n${message}`;

  try {
    const response = await openaiClient.chat.completions.create({
      model: envs.openai.model!,
      messages: [{ role: 'user', content: prompt }],
    });

    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('[OpenAI Request Error]', error);
    throw new Error('Failed to fetch response from OpenAI');
  }
};
