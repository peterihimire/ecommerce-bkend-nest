import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { RoleExceptionFilter } from './exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3000', 'http://example.com'],
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PATCH', 'OPTION'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Access-Control-Allow-Origin',
    ],
    credentials: true,
  });
  const configService = app.get(ConfigService);
  app.setGlobalPrefix('api/ecommerce/v1/');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const port = configService.get('PORT') || 8030;
  // app.useGlobalFilters(new RoleExceptionFilter());
  await app.listen(port);
}
bootstrap();
