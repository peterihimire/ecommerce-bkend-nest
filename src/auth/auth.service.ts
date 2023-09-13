import {
  ForbiddenException,
  Injectable,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async register(dto: AuthDto) {
    const hash = await argon.hash(dto.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hash,
        },
      });

      await this.prisma.profile.create({
        data: {
          userId: user.id,
          acctId: user.acctId,
        },
      });

      delete user.password;
      delete user.id;

      return {
        status: 'success',
        msg: 'Account registered!',
        data: user,
      };
      // return this.signToken(user.acctId, user.email);
    } catch (error) {
      console.log(error);
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Account already exist, please login!');
        }
      }
      throw error;
    }
  }

  async login(dto: AuthDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });

      if (!user) throw new ForbiddenException('Incorrect credentials!');
      const verifyPass = await argon.verify(user.password, dto.password);
      if (!verifyPass) throw new ForbiddenException('Credential incorrect!');

      delete user.password;
      delete user.id;
      delete user.createdAt;
      delete user.updatedAt;

      // return user;
      // return this.signToken(user.acctId, user.email);
      const access_token = await this.signToken(user.acctId, user.email);
      return {
        status: 'success',
        msg: 'User login successful!',
        data: { ...user, ...access_token },
      };
    } catch (error) {
      throw error;
    }
    // return { msg: 'Registration success' };
  }

  async signToken(
    acctId: string,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: acctId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '10m',
      secret: secret,
    });

    return {
      access_token: token,
    };
  }
}
