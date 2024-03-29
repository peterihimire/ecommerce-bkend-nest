import { Injectable, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // @route GET api/admin/get_user_by_acct_id
  // @desc To update user by account ID
  // @access Private
  async profile(user: any) {
    try {
      console.log('This is user payload', user);
      Logger.verbose('This is user payload', user);

      const acct = await this.prisma.user.findUnique({
        where: {
          email: user.data.email,
        },
        include: {
          profile: true,
          userRoles: {
            select: {
              userId: false,
              roleId: true,
            },
          },
        },
      });

      const roleIds = acct.userRoles.map((role) => role.roleId);

      const roles = await this.prisma.role.findMany({
        where: {
          id: { in: roleIds },
        },
      });

      const userWithRoleNames = {
        ...acct,
        roles: roles.map((role) => role.name),
      };

      console.log('These are his roles...', userWithRoleNames);

      if (!acct) throw new ForbiddenException('No user!');
      // const verifyPass = await argon.verify(user.password, password);
      // if (!verifyPass) throw new ForbiddenException('Credential incorrect!');

      delete userWithRoleNames.password;
      delete userWithRoleNames.id;
      delete userWithRoleNames.createdAt;
      delete userWithRoleNames.updatedAt;
      delete userWithRoleNames.profile.createdAt;
      delete userWithRoleNames.profile.updatedAt;
      delete userWithRoleNames.profile.acctId;
      delete userWithRoleNames.profile.id;
      delete userWithRoleNames.profile.userId;

      return {
        status: 'success',
        msg: 'User info',
        data: userWithRoleNames,
      };
    } catch (error) {
      throw error;
    } finally {
      await this.prisma.$disconnect(); // Disconnect the Prisma client
    }
  }
}
