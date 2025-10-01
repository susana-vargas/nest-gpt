import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { GptController } from './gpt/gpt.controller';
import { GptModule } from './gpt/gpt.module';
import { GptService } from './gpt/gpt.service';

@Module({
  imports: [ConfigModule.forRoot(), GptModule],
  controllers: [GptController],
  providers: [GptService],
})
export class AppModule {}
