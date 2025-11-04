import OpenAI from 'openai';

interface Options {
  threadId: string;
  assistantId?: string;
}

export const createRunUseCase = async (openai: OpenAI, options: Options) => {
  //si no nos pasan el id del asistente, tomara el ya definido
  const { threadId, assistantId = 'asst_IrpE81KynBdNQqdSUaceFqGy' } = options;
  const run = await openai.beta.threads.runs.create(threadId, {
    assistant_id: assistantId,
    //instructions: //sobre escrine el asistente
  });
  console.log({ run });
  /*
    salio un error porque no se encontro el asistente creado,
    esto porque el id del asistente debe ser del mismo proyecto
    donde se saco la key de openAI
  */

  return run;
};
