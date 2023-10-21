import {
  Injectable,
  // ForbiddenException, Logger
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddToCartDto } from './dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  // @route GET api/admin/get_user_by_acct_id
  // @desc To update user by account ID
  // @access Private
  async addToCart(dto: AddToCartDto, session: any) {
    type CartType = {
      cartId: number;
      productId: number;
      uuid: string;
      addedBy: string;
      addedAt: Date;
      quantity: number;
    };

    try {
      console.log('This is addtocart  payload', dto);
      console.log('This is session data in service', session);

      let newCart: CartType;
      const newQty = 1;

      const existingUser = await this.prisma.user.findUnique({
        where: { email: session.email },
        include: { cart: { include: { cartProducts: true } } },
      });

      const cart =
        existingUser.cart ||
        (await this.prisma.cart.create({ data: { userId: existingUser.id } }));

      const cartWithProducts = await this.prisma.cart.findUnique({
        where: {
          id: cart.id,
        },
        include: {
          cartProducts: true,
        },
      });

      const product = await this.prisma.product.findUnique({
        where: {
          uuid: dto.productId,
        },
        include: {
          cartProducts: true,
        },
      });
      console.log('This is the cart with product', cartWithProducts);

      const existingCartProd = cartWithProducts.cartProducts.find(
        (item) => item.productId === product.id,
      );

      console.log('This is the existing cart product found', existingCartProd);

      if (existingCartProd) {
        newCart = await this.prisma.cartProducts.update({
          where: {
            productId_cartId: { productId: product.id, cartId: cart.id },
          },
          data: { quantity: existingCartProd.quantity + newQty },
        });
      } else {
        newCart = await this.prisma.cartProducts.create({
          data: {
            quantity: newQty,
            cartId: cart.id,
            productId: product.id,
            addedBy: existingUser.email,
          },
        });
      }

      return {
        status: 'success',
        msg: 'Added to cart',
        data: newCart,
      };
    } catch (error) {
      throw error;
    }
  }

  // @route GET api/admin/get_user_by_acct_id
  // @desc To update user by account ID
  // @access Private
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
