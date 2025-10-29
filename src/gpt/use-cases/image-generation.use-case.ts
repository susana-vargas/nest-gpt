import OpenAI, { toFile } from 'openai';
import * as fs from 'fs';
import * as path from 'path';

import { downloadBase64ImageAsPng, downloadImageAsPng } from 'src/helpers';

interface Options {
  prompt: string;
  originalImage?: string;
  maskImage?: string;
}

export const imageGenerationUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { prompt, originalImage, maskImage } = options;
  // TODO: verificar original image
  if (!originalImage || !maskImage) {
    const response = await openai.images.generate({
      prompt,
      model: 'dall-e-3',
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      response_format: 'url',
    });
    //TODO. guardar la  imagen en FS.
    if (response?.data?.[0].url) {
      const fileName = await downloadImageAsPng(response.data[0].url);
      const url = `${process.env.SERVER_URL}gpt/image-generation/${fileName}`;
      return {
        url: url,
        openAIUrl: response?.data?.[0].url,
        revised_prompt: response?.data?.[0].revised_prompt,
      };
    }

    return {
      url: response?.data?.[0].url,
      openAIUrl: response?.data?.[0].url,
      revised_prompt: response?.data?.[0].revised_prompt,
    };
  }

  //'/Users/susanahernadez/software-development/courses/devtalles/openAI-react-nestJS/nest-gpt/generated/images/1761625338852.png'
  const pngImagePath = await downloadImageAsPng(originalImage, true);
  //'/Users/susanahernadez/software-development/courses/devtalles/openAI-react-nestJS/nest-gpt/generated/images/1761625338968-64.png'
  const maskPath = await downloadBase64ImageAsPng(maskImage, true);

  const imageBuffer = fs.readFileSync(pngImagePath);
  const maskBuffer = fs.readFileSync(maskPath);
  const response = await openai.images.edit({
    // aquí causa el error, lo resive de otro tipo que no es png
    model: 'dall-e-2',
    prompt,
    image: await toFile(imageBuffer, 'image.png', { type: 'image/png' }),
    mask: await toFile(maskBuffer, 'mask.png', { type: 'image/png' }),
    n: 1,
    size: '1024x1024',
    response_format: 'url',
  });
  console.log(response?.data?.[0].url, 'url');
  /*NOTA:
    estos cambios para la solución de la edición de imagenes fue hecho con ayuda de chat gpt y 
    la documentación de openAI, ya que la implementación inicial no funcionaba correctamente y yo no
    sentía que fuera algo facil de resolver ya que se siguieron los mismos pasos en la implementación del curso.
    En este momento igual existe la funcionalidad de variación de imagen pero no funciona, estare repitiendo 
    el curso para solucionar la variación y poder continuar con lo siguiente
  */

  // 2️⃣ Tomamos la URL de la imagen temporal
  const result = response?.data?.[0];
  const openAIUrl = result?.url;

  // 3️⃣ Guardamos la imagen localmente
  const folderPath = path.resolve('./', './generated/images');
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  const fileName = `${Date.now()}.png`;
  const filePath = path.join(folderPath, fileName);
  if (!openAIUrl) {
    throw new Error('No se recibió una URL de imagen de OpenAI');
  }

  const imageResponse = await fetch(openAIUrl);
  const buffer = await imageResponse.arrayBuffer();
  fs.writeFileSync(filePath, Buffer.from(buffer));
  console.log('lo que se retorna', {
    url: `http://localhost:3000/gpt/image-generation/${fileName}`,
    openAIUrl,
    revised_prompt: result?.revised_prompt ?? prompt,
  });

  // 4️⃣ Devolvemos la URL que tu frontend puede usar
  return {
    url: `http://localhost:3000/gpt/image-generation/${fileName}`,
    openAIUrl,
    revised_prompt: result?.revised_prompt ?? prompt,
  };

  // if (response?.data?.[0].url) {//Esto se hacía antes
  //   const fileName = path.basename(response.data?.[0].url);
  //   const url = `${process.env.SERVER_URL}gpt/image-generation/${fileName}`;
  //   console.log('lo que se retorna', {
  //     url: url,
  //     openAIUrl: response?.data?.[0].url,
  //     revised_prompt: response?.data?.[0].revised_prompt,
  //   });

  //   return {
  //     url: url,
  //     openAIUrl: response?.data?.[0].url,
  //     revised_prompt: response?.data?.[0].revised_prompt,
  //   };
  // }
};
