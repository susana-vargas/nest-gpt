import OpenAI from 'openai';
import { downloadImageAsPng } from 'src/helpers';

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
    const url = await downloadImageAsPng(response.data[0].url);
    return url;
  }

  return {
    url: response?.data?.[0].url,
    openAIUrl: response?.data?.[0].url,
    revised_prompt: response?.data?.[0].revised_prompt,
  };
};
