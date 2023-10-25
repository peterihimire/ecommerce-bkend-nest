import {
  Injectable,
  NotFoundException,
  // ForbiddenException, Logger
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto, UpdateOrderDto } from './dto';
// import { title } from 'process';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  // @route POST api/admin/get_user_by_acct_id
  // @desc To update user by account ID
  // @access Private
  async createOrder(dto: CreateOrderDto, session: any) {
    try {
      console.log('This is addtocart  payload', dto);
      console.log('This is session data in service', session);

      const existingUser = await this.prisma.user.findUnique({
        where: { email: session.email },
        include: {
          cart: {
            include: {
              cartProducts: {
                include: {
                  product: {
                    select: {
                      title: true, // Include the fields you need
                      price: true, // Include the fields you need
                    },
                  },
                },
              },
            },
          },
          orders: {
            include: {
              orderProducts: {
                include: {
                  product: {
                    select: {
                      title: true,
                      price: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!existingUser)
        throw new NotFoundException(`Account ${session.email} not found!`);

      const existingCart = existingUser.cart.cartProducts;
      if (!existingCart) throw new NotFoundException('No cart record found!');

      const mappedProducts = existingCart.map((product) => {
        return {
          amount: product.product.price,
          quantity: product.quantity,
          address: dto.address,
          productId: product.productId,
          addedBy: existingUser.acctId,
        };
      });

      const createdOrder = await this.prisma.order.create({
        data: {
          customerId: existingUser.id,
          orderProducts: { create: mappedProducts },
        },
        include: {
          orderProducts: true,
        },
      });

      return {
        status: 'success',
        msg: 'Available cart order',
        data: createdOrder,
      };
    } catch (error) {
      throw error;
    } finally {
      await this.prisma.$disconnect(); // Disconnect the Prisma client
    }
  }

  // @route GET api/admin/get_user_by_acct_id
  // @desc To update user by account ID
  // @access Private
  async getOrderById(orderId: string, session: any) {
    console.log('OrderId id', orderId);
    console.log('session info', session);

    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: session.email },
        include: {
          orders: {
            include: {
              orderProducts: {
                include: {
                  product: {
                    select: {
                      title: true,
                      price: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!existingUser)
        throw new NotFoundException(`Account ${session.email} not found!`);

      const existingOrder = existingUser.orders;
      if (!existingOrder) throw new NotFoundException('No cart record found!');
      const singleOrder = await this.prisma.order.findUnique({
        where: {
          uuid: orderId,
        },
        include: {
          orderProducts: {
            include: {
              product: {
                select: {
                  title: true,
                  price: true,
                },
              },
            },
          },
        },
      });
      console.log('This is the single order', singleOrder);

      const totalOrderPrice = singleOrder.orderProducts.reduce(
        (total, item) => {
          return total + Number(item.amount) * item.quantity;
        },
        0,
      );

      const totalOrderQty = singleOrder.orderProducts.reduce((total, item) => {
        return total + item.quantity;
      }, 0);

      console.log('This is the total Order price', totalOrderPrice);
      console.log('This is the total Order quantity', totalOrderQty);

      return {
        status: 'success',
        msg: 'Order info!',
        data: {
          ...singleOrder,
          totalQuantity: totalOrderQty,
          totalAmount: totalOrderPrice,
        },
      };
    } catch (error) {
      throw error;
    } finally {
      await this.prisma.$disconnect(); // Disconnect the Prisma client
    }
  }

  // @route GET api/admin/get_user_by_acct_id
  // @desc To update user by account ID
  // @access Private
  async getOrder(session: any) {
    console.log('session info', session);

    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: session.email },
        include: {
          cart: {
            include: {
              cartProducts: {
                include: {
                  product: {
                    select: {
                      title: true, // Include the fields you need
                      price: true, // Include the fields you need
                    },
                  },
                },
              },
            },
          },
          orders: {
            include: {
              orderProducts: {
                include: {
                  product: {
                    select: {
                      title: true,
                      price: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!existingUser)
        throw new NotFoundException(`Account ${session.email} not found!`);

      const existingOrder = existingUser.orders;
      if (!existingOrder) throw new NotFoundException('No cart record found!');

      // const cartProducts = existingOrder.map((product) => {
      //   return {
      //     name: product.product.title,
      //     price: product.product.price,
      //     quatity: product.quantity,
      //   };
      // });

      // const totalCartPrice = cartProducts.reduce((total, item) => {
      //   return total + item.price * item.quatity;
      // }, 0);

      // const totalCartQty = cartProducts.reduce((total, item) => {
      //   return total + item.quatity;
      // }, 0);

      // console.log('This is the total cart price', totalCartPrice);
      // console.log('This is the total cart quantity', totalCartQty);

      return {
        status: 'success',
        msg: 'All User Orders!',
        data: existingOrder,
        // data: {
        //   products: cartProducts,
        //   totalCartQty,
        //   totalPrice: totalCartPrice,
        // },
      };
    } catch (error) {
      throw error;
    } finally {
      await this.prisma.$disconnect(); // Disconnect the Prisma client
    }
  }

  // @route PATCH api/admin/get_user_by_acct_id
  // @desc To update user by account ID
  // @access Private
  async updateOrder(dto: UpdateOrderDto, session: any) {
    type CartType = {
      cartId: number;
      productId: number;
      uuid: string;
      addedBy: string;
      addedAt: Date;
      quantity: number;
    };
    let updatedCart: CartType;

    try {
      console.log('update cart dto', dto);
      console.log('session info', session);

      const existingUser = await this.prisma.user.findUnique({
        where: { email: session.email },
        include: {
          cart: {
            include: {
              cartProducts: {
                include: {
                  product: {
                    select: {
                      title: true, // Include the fields you need
                      price: true, // Include the fields you need
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!existingUser)
        throw new NotFoundException(`Account ${session.email} not found!`);

      const cartWithProducts = await this.prisma.cart.findUnique({
        where: {
          id: existingUser.cart.id,
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

      if (!product)
        throw new NotFoundException(`Product not available in your cart!`);

      const existingCartProd = cartWithProducts.cartProducts.find(
        (item) => item.productId === product.id,
      );

      if (!existingCartProd) {
        throw new NotFoundException(
          `Product ${product.title} not found in the cart!`,
        );
      }

      // const existingProdQty = existingCartProd.quantity;
      if (existingCartProd.quantity === 0) {
        updatedCart = await this.prisma.cartProducts.delete({
          where: {
            productId_cartId: {
              productId: product.id,
              cartId: existingUser.cart.id,
            },
          },
        });
        console.log('This line was accessed bray!');
        throw new NotFoundException(
          `Product ${product.title} not found in the cart! O ti loo~!`,
        );
      } else {
        updatedCart = await this.prisma.cartProducts.update({
          where: {
            productId_cartId: {
              productId: product.id,
              cartId: existingUser.cart.id,
            },
          },
          data: { quantity: existingCartProd.quantity + dto.quantity },
        });
      }

      if (updatedCart.quantity === 0) {
        return {
          status: 'success',
          msg: `Product ${product.title} removed from cart`,
        };
      }

      console.log('This is updated cart info', updatedCart);

      return {
        status: 'success',
        msg: 'Cart updated',
        data: updatedCart,
      };
    } catch (error) {
      throw error;
    } finally {
      await this.prisma.$disconnect(); // Disconnect the Prisma client
    }
  }
}
