import OpenAI from 'openai';

interface Options {
  threadId: string;
  runId: string;
}

export const checkCompleteStatusUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { threadId, runId } = options;

  const runStatus = await openai.beta.threads.runs.retrieve(runId, {
    thread_id: threadId,
  });
  console.log({ status: runStatus.status });

  if (runStatus.status === 'completed') {
    return runStatus;
  }

  //Esperar un segundo
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // si no esta en completed se vuelve a disparar la funcion para hacer l verificacion
  return await checkCompleteStatusUseCase(openai, options);
};
