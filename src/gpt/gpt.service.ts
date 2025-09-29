import { Injectable } from '@nestjs/common';
import { orthographyCheckUseCase } from './use-cases';

@Injectable()
export class GptService {
  // llaama a casos de uso
  async orthographyCheck() {
    return await orthographyCheckUseCase();
  }
}
