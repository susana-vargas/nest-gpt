import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { GptController } from './gpt/gpt.controller';
import { GptModule } from './gpt/gpt.module';
import { GptService } from './gpt/gpt.service';
import { SamAssistantModule } from './sam-assistant/sam-assistant.module';

@Module({
  imports: [ConfigModule.forRoot(), GptModule, SamAssistantModule],
  controllers: [GptController],
  providers: [GptService],
})
export class AppModule {}
