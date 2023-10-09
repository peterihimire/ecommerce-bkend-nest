import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import * as passport from 'passport';
import * as session from 'express-session';
import { RedisModule } from './redis/redis.module';
import { createClient } from 'redis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisService } from './redis/redis.service';
import RedisStore from 'connect-redis';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    CartModule,
    PrismaModule,
    RedisModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, RedisService],
})
export class AppModule implements NestModule {
  constructor(private readonly configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    // Session
    const redisUrl: string = this.configService.get('REDIS_URL');
    const redisClient = createClient({
      url: redisUrl,
      legacyMode: false,
    });
    redisClient.connect().catch(console.error);

    // Initialize store.
    const redisStore = new RedisStore({
      client: redisClient,
      prefix: 'ecommerce-app:',
    });

    redisClient.on('error', (err) =>
      Logger.error('Could not establish a connection with redis. ' + err),
    );
    redisClient.on('connect', () =>
      Logger.verbose('Connected to redis successfully(middleware)'),
    );
    consumer
      .apply(
        session({
          store: redisStore,
          secret: this.configService.get('SESSION_SECRET'),
          saveUninitialized: false,
          resave: false,
          cookie: {
            sameSite: true,
            httpOnly: false,
            maxAge: 1000 * 60 * 60,
            secure: false,
          },
        }),
        passport.initialize(),
        passport.session(),
      )
      .forRoutes('*');
  }
}
