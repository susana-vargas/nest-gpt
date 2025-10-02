import OpenAI from 'openai';

interface Options {
  prompt: string;
}

export const prosConsDicusserStreamUseCase = async (
  openai: OpenAI,
  { prompt }: Options,
) => {
  return await openai.chat.completions.create({
    stream: true, // para que la respuesta sea en stream
    messages: [
      {
        role: 'system',
        // de acuerdo a la respesta de la tarea que se mostro en el curso no se agrego el Ejemplo de salida
        content: `
        Se te dará una pregunta y tu tarea es dar una respuesta con pros y contras,
        la respuesta debe de ser en formato markdown,
        los pros y contras deben de estar en una lista,
        `,
      },
      {
        role: 'user',
        content: prompt, // se pasa el prompt desde el body de postman
      },
    ],
    model: 'gpt-3.5-turbo',
  });
};
