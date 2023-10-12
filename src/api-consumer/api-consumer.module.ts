import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { ApiConsumerService } from './api-consumer.service';
import { FestivalModule } from '../festival/festival.module';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: process.env.EXTERNAL_API_TIMEOUT ? +process.env.EXTERNAL_API_TIMEOUT : 5000,
        maxRedirects: process.env.EXTERNAL_API_MAX_REDIRECT ? +process.env.EXTERNAL_API_MAX_REDIRECT : 5,
      }),
    }),
    FestivalModule
  ],
  providers: [ApiConsumerService],
  exports: [ApiConsumerService],
})
export class ApiConsumerModule {}
