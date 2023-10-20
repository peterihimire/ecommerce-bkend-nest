import {
  Injectable,
  // ForbiddenException, Logger
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddToCartDto } from './dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async addToCart(dto: AddToCartDto, session: any) {
    type CartType = {
      id: number;
      createdAt: Date;
      updatedAt: Date;
      userId: number;
    };
    try {
      console.log('This is addtocart  payload', dto);
      console.log('This is session data in service', session);

      let fetchedCart: CartType;
      let newQty = 1;

      const existingUser = await this.prisma.user.findUnique({
        where: { email: session.email },
        include: {
          cart: true,
        },
      });

      if (!existingUser.cart) {
        const createdCart = await this.prisma.cart.create({
          data: {
            userId: existingUser.id,
          },
        });
        fetchedCart = createdCart;
      } else {
        fetchedCart = existingUser.cart;
      }

      console.log('This is the existing user info', existingUser);
      console.log('This is the fetched cart', fetchedCart);

      const existingProduct = await this.prisma.cartProducts.findMany({
        where: {
          cartId: fetchedCart.id,
        },
        include: {
          product: true, // Assuming `product` is the relation name
        },
      });

      // if (existingProduct.length) {
      //   const cartProductId = existingProduct[0].productId; // Replace with your actual field name
      //   const cartProduct = await this.prisma.cartProducts.findUnique({
      //     where: { id: cartProductId },
      //     select: { quantity: true }, // Assuming `quantity` is the field you want to select
      //   });

      console.log('This is existing product', existingProduct);
      console.log('This is new quantity', (newQty = newQty));

      // Logger.verbose('This is user payload', user);

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

// const acct = await this.prisma.user.findUnique({
//   where: {
//     email: user.data.email,
//   },
// include: {
//   profile: true,
//   roles: {
//     select: {
//       userId: false,
//       roleId: true,
//     },
//   },
// },
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

// const existingProduct = await this.prisma.product.findUnique({
//   where: {
//     prodId: dto.productId,
//   },
//   include: {
//     carts: {
//       where: {
//         cartId: availableCart.id,
//       },
//       include: {
//         cart_products: {
//           where: {
//             productId: existingProduct.id, // Assuming the product ID is in the existingProduct.id field
//           },
//           select: {
//             quantity: true,
//           },
//         },
//       },
//     },
//   },
// });

// if (
//   existingProduct &&
//   existingProduct.carts.length &&
//   existingProduct.carts[0].CartProducts.length
// ) {
//   newQty = existingProduct.carts[0].CartProducts[0].quantity + 1;
// }

// const existingProduct = await this.prisma.product.findMany({
//   where: {
//     prodId: dto.productId,
//     carts: {
//       some: { cartId: availableCart.id },
//     },
//   },
//   // include: {
//   //   carts: { include: { products: true } },
//   // },
// });

// const existingProduct = await this.prisma.cart.findMany({
//   where: {
//     id: availableCart.id,
//   },
//   include: {
//     products: true,
//   },
// });

//   if (cartProduct) {
//     newQty = cartProduct.quantity + 1;
//   }
// }

// if (existingProduct.length) {
//   newQty = (await existingProduct[0].CartProducts.quantity) + 1;
// }

// if (existingProduct) {
//   newQty = existingProduct.quantity + 1;
//   await this.prisma.cartProducts.update({
//     where: { id: existingProduct.id },
//     data: { quantity: newQty },
//   });
// } else {
//   await this.prisma.cartProducts.create({
//     data: {
//       quantity: newQty,
//       productId: existingProduct.id,
//       cartId: existingUser.cart.id,
//     },
//   });
// }
