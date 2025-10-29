import OpenAI, { toFile } from 'openai';
import * as fs from 'fs';

import { downloadImageAsPng } from 'src/helpers';

interface Options {
  baseImage: string;
}

export const imageVariationUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { baseImage } = options;
  //OpenAI recomienda que para variaciones y ediciones, no se use fs.createReadStream directo, sino toFile
  const pngImagePath = await downloadImageAsPng(baseImage, true);
  const buffer = fs.readFileSync(pngImagePath);
  const response = await openai.images.createVariation({
    model: 'dall-e-2',
    image: await toFile(buffer, 'image.png', { type: 'image/png' }),
    n: 1,
    size: '1024x1024',
    response_format: 'url',
  });
  /*
    createReadStream() no trae MIME(metadata de la imagen)
    toFile() agrega el MIME(metadata de la imagen) y lo convierte en un formato que OpenAI acepta (png)
   */
  if (response?.data?.[0].url) {
    const fileName = await downloadImageAsPng(response.data[0].url);
    const url = `${process.env.SERVER_URL}gpt/image-generation/${fileName}`;

    return {
      url: url,
      openAIUrl: response?.data?.[0].url,
      revised_prompt: response?.data?.[0].revised_prompt,
    };
  }
};
