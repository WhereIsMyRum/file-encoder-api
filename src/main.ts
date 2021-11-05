import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = getSwaggerConfig();

  app.setGlobalPrefix('api');

  SwaggerModule.setup(
    '/api/doc',
    app,
    SwaggerModule.createDocument(app, config),
  );

  await app.listen(3000);
}
bootstrap();

function getSwaggerConfig(): Omit<OpenAPIObject, 'paths'> {
  return new DocumentBuilder()
    .setTitle('File Encoder Api')
    .setDescription('The file encoder API description')
    .setVersion('1.0')
    .addTag('File Encoder')
    .build();
}
