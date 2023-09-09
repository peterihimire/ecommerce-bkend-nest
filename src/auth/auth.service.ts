import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async register(dto: AuthDto) {
    const hash = await argon.hash(dto.password);

    try {
      const user = await this.prisma.user.create({
        data: { email: dto.email, password: hash },
      });

      await this.prisma.profile.create({
        data: { userId: user.id, acctId: user.acctId },
      });

      delete user.password;
      delete user.id;

      return user;
    } catch (error) {
      console.log(error);
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Account already exist, please login!');
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

      return user;
    } catch (error) {
      throw error;
    }
    // return { msg: 'Registration success' };
  }
}
