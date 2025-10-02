import OpenAI from 'openai';

interface Options {
  prompt: string;
}

export const prosConsDicusserUseCase = async (
  openai: OpenAI,
  { prompt }: Options,
) => {
  const response = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `
        Se te dará una pregunta y tu tarea es dar una respuesta con pros y contras,
        la respuesta debe de ser en formato markdown,
        los pros y contras deben de estar en una lista,
        
        Ejemplo de salida:

        **Pros:**
        - Punto positivo 1
        - Punto positivo 2
        - Punto positivo 3

        **Contras:**
        - Punto negativo 1
        - Punto negativo 2
        - Punto negativo 3
        `,
      },
      {
        role: 'user',
        content: prompt, // se pasa el prompt desde el body de postman
      },
    ],
    model: 'gpt-3.5-turbo',
  });

  return response.choices[0].message;
};
