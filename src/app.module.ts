import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { MailerModule } from '@nestjs-modules/mailer';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { LoggerMiddleware } from './common/middleware/logger/logger.middleware';
import { UserModule } from './user/user.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { dataSourceOpt } from './common/constant/datasource-opt.const';
import { MailModule } from './mail/mail.module';
import { mailerOpt } from './common/constant/mailer-opt-const';
import { ApiConsumerModule } from './api-consumer/api-consumer.module';
import { FestivalModule } from './festival/festival.module';
import { ApiConsumerService } from './api-consumer/api-consumer.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', process.env.STATIC_DIRNAME!),
    }),
    MulterModule.register({
      dest: join(__dirname, '..', process.env.STATIC_DIRNAME!),
      limits: {
        fileSize: process.env.UPLOAD_MAX_FILE_SIZE
          ? +process.env.UPLOAD_MAX_FILE_SIZE
          : 5242880,
      },
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => dataSourceOpt as TypeOrmModuleAsyncOptions,
    }),
    MailerModule.forRootAsync({
      useFactory: () => mailerOpt,
    }),
    UserModule,
    AuthenticationModule,
    MailModule,
    ApiConsumerModule,
    FestivalModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  constructor(private readonly apiConsumerSrv : ApiConsumerService){
    if (process.env.GET_DATA_FROM_EXTERNAL_AT_START === 'true') {
      this.apiConsumerSrv.getFestivals();
    }
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('');
  }
}
