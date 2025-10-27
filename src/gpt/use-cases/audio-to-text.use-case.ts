import OpenAI from 'openai';
import * as fs from 'fs';

interface Options {
  prompt?: string;
  audioFile: Express.Multer.File;
}

export const audioToTextUseCase = async (openAi: OpenAI, options: Options) => {
  const { prompt, audioFile } = options;
  console.log({ prompt, audioFile });

  const response = openAi.audio.transcriptions.create({
    model: 'whisper-1',
    file: fs.createReadStream(audioFile.path),
    prompt, //mismo idioma que el audio
    language: 'es',
    response_format: 'verbose_json',
  });
  console.log(response, 'response');

  return response;
};
