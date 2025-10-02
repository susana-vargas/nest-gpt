import { Injectable } from '@nestjs/common';

import OpenAI from 'openai';

import {
  orthographyCheckUseCase,
  prosConsDicusserStreamUseCase,
} from './use-cases';
import { OrthographyDto } from './dtos';
import { prosConsDicusserUseCase } from './use-cases';
import { ProsConsDiscusserDto } from './dtos/pros-cons-discusser.dto';

@Injectable()
export class GptService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // llama a casos de uso
  async orthographyCheck(orthographyDto: OrthographyDto) {
    return await orthographyCheckUseCase(this.openai, {
      prompt: orthographyDto.prompt,
    });
  }

  async prosConsDicusser({ prompt }: ProsConsDiscusserDto) {
    return await prosConsDicusserUseCase(this.openai, { prompt });
  }

  async prosConsDicusserStream({ prompt }: ProsConsDiscusserDto) {
    return await prosConsDicusserStreamUseCase(this.openai, { prompt });
  }
}
