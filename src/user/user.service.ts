import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async profile(user: any) {
    try {
      console.log('This is user payload', user);

      const acct = await this.prisma.user.findUnique({
        where: {
          email: user.data.email,
        },
      });

      const profile = await this.prisma.profile.findUnique({
        where: {
          acctId: user.data.acctId,
        },
      });

      if (!acct) throw new ForbiddenException('No user!');
      delete acct.password;
      delete acct.id;
      delete acct.createdAt;
      delete acct.updatedAt;
      delete profile.createdAt;
      delete profile.updatedAt;
      return {
        status: 'success',
        msg: 'User info',
        data: {
          ...acct,
          profile,
        },
      };
      // return {
      //   msg: 'Dashboard success',
      // };
    } catch (error) {
      throw error;
    }
  }
}
