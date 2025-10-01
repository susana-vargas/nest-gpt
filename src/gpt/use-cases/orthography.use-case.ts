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
        content: `
        Te serán proporcionados textos en español con posibles errores ortográficos y gramaticales,
        Las palabras usadas deben de existir en el diccionario de la Real Academia Española,
        Debes de responder en formato JSN,
        tu tarea es corregir y retornar información soluciones,
        también debes de dar un porcentaje de acierto por el usuario,

        Si no hay errores, debes de retornar un mensaje de felicitaciones.

        Ejemplo de salida:
        {
          userScore: number,
          errors: [], // ['error -> solución']
          message: string // Usa emojis y texto para felicitar al usuario
        }
        `,
      },
      {
        role: 'user',
        content: prompt, // se pasa el prompt desde el body de postman
      },
    ],
    model: 'gpt-3.5-turbo',
  });

  //console.log(completion);
  const content = completion.choices[0].message.content;

  if (!content) {
    throw new Error('La respuesta del modelo vino vacía (null).');
  }

  const jsonResponse = JSON.parse(content);
  return jsonResponse;
};
