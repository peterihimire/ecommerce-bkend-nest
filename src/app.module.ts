import { Inject, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import * as passport from 'passport';
import * as session from 'express-session';
import { RedisModule } from './redis/redis.module';
import { REDIS } from './redis/redis.constants';
// import { createClient } from 'redis';
// import { RedisMiddleware } from './redis/redis.middleware';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    RedisModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(@Inject(REDIS) private readonly redis) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        session({
          store: this.redis,
          secret: 'sup3rs3cr3t',
          saveUninitialized: false,
          resave: false,
          cookie: {
            sameSite: true,
            httpOnly: false,
            maxAge: 60000,
          },
        }),
        passport.initialize(),
        passport.session(),
      )
      .forRoutes('users');
  }
}
// RedisMiddleware, passport.initialize(), passport.session()
