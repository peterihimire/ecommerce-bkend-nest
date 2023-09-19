import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Redis from 'redis';
// import { REDIS } from './redis.constants';

@Injectable()
export class RedisService {
  constructor(config: ConfigService) {
    const redisClient = Redis.createClient({
      url: config.get<string>('REDIS_URL'),
      legacyMode: false,
    });

    redisClient.on('error', (err) =>
      Logger.error('Could not establish a connection with redis. ' + err),
    );

    redisClient.on('connect', () =>
      Logger.verbose('Connected to redis-MIDDLEWARE successfully'),
    );
  }
}
