import OpenAI from 'openai';

interface Options {
  prompt: string;
  lang: string;
}

export const translateUseCase = async (
  openai: OpenAI,
  { prompt, lang }: Options,
) => {
  const response = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `Traduce el siguiente texto al idioma ${lang}:${prompt}`,
      },
    ],
    model: 'gpt-3.5-turbo',
  });

  return response.choices[0].message.content;
};
