import OpenAI from 'openai';

interface Options {
  prompt: string;
}

export const orthographyCheckUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { prompt } = options;

  //TODO: no se puedo realizar la prueba de hacer el primer prompt a la API de
  // GPT ya que para la key que tenemos ya no tiene créditos gratuitos y salio un error 429

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content:
          'tu nombre es Camilo, debes responder amablemente siempre y dar tu nombre',
      },
      {
        role: 'user',
        content: prompt, // se pasa el prompt desde el body de postman
      },
    ],
    model: 'gpt-3.5-turbo',
  });

  console.log(completion);
  return completion.choices[0];
};
