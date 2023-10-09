import {
  Injectable,
  // ForbiddenException, Logger
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddToCartDto } from './dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async addToCart(dto: AddToCartDto) {
    try {
      console.log('This is addtocart  payload', dto);
      // // Logger.verbose('This is user payload', user);

      // const acct = await this.prisma.user.findUnique({
      //   where: {
      //     email: user.data.email,
      //   },
      //   include: {
      //     profile: true,
      //     roles: {
      //       select: {
      //         userId: false,
      //         roleId: true,
      //       },
      //     },
      //   },
      // });

      // const roleIds = acct.roles.map((role) => role.roleId);

      // const roles = await this.prisma.role.findMany({
      //   where: {
      //     id: { in: roleIds },
      //   },
      // });

      // const userWithRoleNames = {
      //   ...acct,
      //   roles: roles.map((role) => role.name),
      // };

      // console.log('These are his roles...', userWithRoleNames);

      // if (!acct) throw new ForbiddenException('No user!');
      // // const verifyPass = await argon.verify(user.password, password);
      // // if (!verifyPass) throw new ForbiddenException('Credential incorrect!');

      // delete userWithRoleNames.password;
      // delete userWithRoleNames.id;
      // delete userWithRoleNames.createdAt;
      // delete userWithRoleNames.updatedAt;
      // delete userWithRoleNames.profile.createdAt;
      // delete userWithRoleNames.profile.updatedAt;
      // delete userWithRoleNames.profile.acctId;
      // delete userWithRoleNames.profile.id;
      // delete userWithRoleNames.profile.userId;

      return {
        status: 'success',
        msg: 'Add to cart',
        // data: userWithRoleNames,
      };
    } catch (error) {
      throw error;
    }
  }

  async getCart(id: number) {
    console.log('Product id', id);

    try {
      return {
        status: 'success',
        msg: 'Cart info',
        // data: userWithRoleNames,
      };
    } catch (error) {
      throw error;
    }
  }
}
