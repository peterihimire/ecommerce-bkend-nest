import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.setGlobalPrefix('api/ecommerce/v1/');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const port = configService.get('PORT') || 8030;
  await app.listen(port);
}
bootstrap();
