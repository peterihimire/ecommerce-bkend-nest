import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as passport from 'passport';
import * as session from 'express-session';
import * as createRedisStore from 'connect-redis';

import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';
// import { createClient } from 'redis';
// import * as Redis from 'redis';
import Redis from 'ioredis';

// import { REDIS } from './redis.constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.setGlobalPrefix('api/ecommerce/v1/');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Session
  // const RedisStore = createRedisStore(session);
  // const redisHost: string = configService.get('REDIS_HOST');
  // const redisPort: number = +configService.get('REDIS_PORT');
  // const redisClient = createClient({
  //   host: redisHost,
  //   port: redisPort,
  // });

  const RedisStore = createRedisStore(session);
  const redisHost: string = configService.get('REDIS_HOST');
  const redisPort: number = +configService.get('REDIS_PORT');
  const redisClient = new Redis(redisPort, redisHost);

  redisClient.on('error', (err) =>
    Logger.error('Could not establish a connection with redis. ' + err),
  );
  redisClient.on('connect', () =>
    Logger.verbose('Connected to redis successfully'),
  );

  app.use(
    session({
      store: new RedisStore({ client: redisClient as any }),
      secret: configService.get('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: 'none', //strict
        secure: false,
        // secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      },
    }),
  );
  app.use(passport.initialize());
  app.use(cookieParser());
  app.use(passport.session());

  // CSURF must be after cookie-parser & session
  app.use(csurf());
  const port = configService.get('PORT') || 8030;
  await app.listen(port);
}
bootstrap();
