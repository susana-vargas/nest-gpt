import OpenAI from 'openai';

interface Options {
  baseImage: string;
}

export const imageVariationUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { baseImage } = options;
  // const response = await openai.images.createVariation({
  //   image: baseImage,
  //   n: 1,
  //   size: '1024x1024',
  // });

  // return response.data[0].url;
  console.log({ baseImage });

  return baseImage;
};
