import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy, LocalStrategy } from './strategy';
import { PassportModule } from '@nestjs/passport';
import { SessionSerializer } from './serializer';
import { RoleGuard } from './guard';
// import { LocalStrategy } from './strategy/local.strategy';
// import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  // imports: [PrismaModule],
  imports: [JwtModule.register({}), PassportModule.register({ session: true })],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    LocalStrategy,
    SessionSerializer,
    RoleGuard,
  ],
})
export class AuthModule {}
