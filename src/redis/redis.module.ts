import { Module } from '@nestjs/common';
// import { REDIS } from './redis.constants';
import { RedisService } from './redis.service';

console.log('This is the imported Redis_service', RedisService);
@Module({
  providers: [
    RedisService,
    // {
    //   provide: REDIS,
    //   useValue: RedisService,
    // },
  ],
  // exports: [REDIS],
})
export class RedisModule {}
