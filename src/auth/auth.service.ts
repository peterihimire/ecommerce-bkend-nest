import {
  ForbiddenException,
  Injectable,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto, RegDto } from './dto';
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

  // @route GET api/admin/get_user_by_acct_id
  // @desc To update user by account ID
  // @access Private
  async register(dto: RegDto) {
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
      console.log('This is for user...', user);

      if (dto.roles) {
        const roleNames = dto.roles;
        console.log('This is  roles dto', roleNames);

        const userRoles = await this.prisma.role.findMany({
          where: {
            name: {
              in: roleNames,
            },
          },
        });

        console.log('These are the roles names', userRoles);

        const userRolesData = userRoles.map((role) => ({
          userId: user.id,
          roleId: role.id,
        }));

        console.log('This is  the user roles', userRolesData);

        await this.prisma.userRoles.createMany({
          data: userRolesData,
        });
      } else {
        // If no roles are provided, you can connect a default role (e.g., role with ID 1)
        await this.prisma.userRoles.create({
          data: {
            userId: user.id,
            roleId: 1, // Assuming the default role ID is 1
          },
        });
      }

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

  // @route GET api/admin/get_user_by_acct_id
  // @desc To update user by account ID
  // @access Private
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
    } finally {
      await this.prisma.$disconnect(); // Disconnect the Prisma client
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
      expiresIn: '1h',
      secret: secret,
    });

    return {
      access_token: token,
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) throw new ForbiddenException('Incorrect credentials!');
    const verifyPass = await argon.verify(user.password, password);
    if (!verifyPass) throw new ForbiddenException('Credential incorrect!');

    delete user.password;
    delete user.id;
    delete user.createdAt;
    delete user.updatedAt;

    return user;
  }

  // @route GET api/admin/get_user_by_acct_id
  // @desc To update user by account ID
  // @access Private
  async verifyUser(email: string, password: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: email,
        },
        include: {
          // profile: true,
          userRoles: {
            select: {
              userId: false,
              roleId: true,
            },
          },
        },
      });

      if (!user) throw new ForbiddenException('Incorrect login credentials!');
      const verifyPass = await argon.verify(user.password, password);
      if (!verifyPass)
        throw new ForbiddenException('Credential to login incorrect!');

      const roleIds = user.userRoles.map((role) => role.roleId);

      const roles = await this.prisma.role.findMany({
        where: {
          id: { in: roleIds },
        },
      });

      const userWithRoleNames = {
        ...user,
        roles: roles.map((role) => role.name),
      };

      console.log('These are his roles...', userWithRoleNames);

      delete userWithRoleNames.password;
      delete userWithRoleNames.id;
      delete userWithRoleNames.createdAt;
      delete userWithRoleNames.updatedAt;
      delete userWithRoleNames.userRoles;

      return {
        status: 'success',
        msg: 'Login successful!',
        data: userWithRoleNames,
      };
    } catch (error) {
      throw error;
    } finally {
      await this.prisma.$disconnect(); // Disconnect the Prisma client
    }
  }

  // // @route GET api/admin/get_user_by_acct_id
  // // @desc To update user by account ID
  // // @access Private
  // async signout() {
  //   try {
  //     return {
  //       status: 'success',
  //       msg: 'Logout successful!',
  //     };
  //   } catch (error) {
  //     throw error;
  //   } finally {
  //     await this.prisma.$disconnect(); // Disconnect the Prisma client
  //   }
  // }
}
