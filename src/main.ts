import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import metadata from './metadata'; // <-- file auto-generated by the "PluginMetadataGenerator"

async function bootstrapApp() {
  const app = await NestFactory.create(AppModule, { abortOnError: false });
  app.enableCors({
    origin: '*',
    methods: '*'
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await SwaggerModule.loadPluginMetadata(metadata);
  const swaggerConfig = new DocumentBuilder()
    .setTitle('nest_api_template')
    .setDescription('a basic rest api built with Nest.js')
    .setVersion('1.0')
    .addBearerAuth()
    .addSecurityRequirements('bearer')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, swaggerDocument);

  await app.listen(process.env.PORT_LISTEN ?? 3003);

  console.log(process.env.NODE_ENV);
}
bootstrapApp();
