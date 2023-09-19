import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as Redis from 'redis';
import RedisStore from 'connect-redis';
import * as session from 'express-session';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisMiddleware implements NestMiddleware {
  private readonly sessionMiddleware: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => void;

  constructor(private readonly configService: ConfigService) {
    const redisClient = Redis.createClient({
      url: this.configService.get<string>('REDIS_URL'),
      legacyMode: false,
    });

    redisClient.on('error', (err) =>
      Logger.error('Could not establish a connection with redis. ' + err),
    );

    redisClient.on('connect', () =>
      Logger.verbose('Connected to redis-MIDDLEWARE successfully'),
    );

    const redisStore = new RedisStore({ client: redisClient });

    this.sessionMiddleware = session({
      store: redisStore,
      secret: this.configService.get('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: 'none',
        maxAge: 1000 * 60 * 1,
        secure: process.env.NODE_ENV === 'production',
      },
    });
  }
  use(req: Request, res: Response, next: NextFunction) {
    this.sessionMiddleware(req, res, next);
  }
}
