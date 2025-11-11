import * as fs from 'fs';

import OpenAI from 'openai';

interface Options {
  prompt?: string;
  imageFile: Express.Multer.File;
}

//se construye ma imagen en base64 para enviarla a openai
const convertToBase64 = (file: Express.Multer.File) => {
  const data = fs.readFileSync(file.path);
  const base64 = Buffer.from(data).toString('base64');
  //se especifica el tipo de la imagen
  return `data:image/${file.mimetype.split('/')[1]};base64,${base64}`;
};

export const imageToTextUseCase = async (openai: OpenAI, options: Options) => {
  const { imageFile, prompt } = options;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: prompt ?? '¿Qué logras ver en la imagen?',
          },
          {
            type: 'image_url',
            image_url: {
              //se puede mandar la url de la imagen
              url: convertToBase64(imageFile),
            },
          },
        ],
      },
    ],
  });

  return { msg: response.choices[0].message.content };
};
