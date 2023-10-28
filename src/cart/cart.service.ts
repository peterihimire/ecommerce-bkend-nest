import {
  Injectable,
  NotFoundException,
  // ForbiddenException, Logger
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddToCartDto, UpdateCartDto } from './dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  // @route POST api/admin/get_user_by_acct_id
  // @desc To update user by account ID
  // @access Private
  async addToCart(dto: AddToCartDto, session?: any) {
    type CartType = {
      cartId: number;
      productId: number;
      uuid: string;
      addedBy: string;
      addedAt: Date;
      quantity: number;
    };

    try {
      let newCart: CartType;
      const newQty = 1;

      if (session === undefined || !session) {
        console.log('Now add the logic for un-authenticated users...');

        // User is unauthenticated
        // Handle cart logic for unauthenticated users, e.g., save in session
        console.log('Tis is session', session);
        let cartData = session?.cart || {};

        if (session === undefined) {
          session = {
            cart: {
              userId: 'mypersonalid',
              products: [],
              totalQty: 3,
              totalPrice: 200,
            },
          };
          cartData = session.cart;
        }

        // const productId = dto.productId;

        const productId = dto.productId;
        const productIndex = cartData.products.findIndex(
          (product) => product.productId === productId,
        );

        if (productIndex !== -1) {
          cartData.products[productIndex].quantity += newQty;
        } else {
          cartData.products.push({
            productId,
            quantity: newQty,
            // Add other product details if available
          });
        }

        cartData.totalQty += newQty;

        // console.log('Lets see if it has been openned...', session);
        session.cart = cartData;
        // session.cart.products.push(cartData);

        console.log('This is the cart data', cartData);

        newCart = {
          // Define cart information for unauthenticated users
          cartId: 2, // Assuming a placeholder value for unauthenticated user's cart
          productId: 2, // Placeholder values
          uuid: '8b64a7a3-5af6-4f4e-8558-6344bffb51vf', // Placeholder values
          addedBy: 'Unauthenticated User', // Placeholder value
          addedAt: new Date(), // Current date and time
          quantity: newQty,
        };

        return {
          status: 'success',
          msg: 'Added to cart',
          data: newCart,
        };
        // throw new NotFoundException(`Account Not found!`);
      }
      console.log('This is addtocart  payload', dto);
      console.log('This is session data in service', session);

      // let newCart: CartType;
      // const newQty = 1;

      const existingUser = await this.prisma.user.findUnique({
        where: { email: session.email },
        include: { cart: { include: { cartProducts: true } } },
      });

      if (!existingUser)
        throw new NotFoundException(`Account ${session.email} not found!`);

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
    } finally {
      await this.prisma.$disconnect(); // Disconnect the Prisma client
    }
  }

  // @route GET api/admin/get_user_by_acct_id
  // @desc To update user by account ID
  // @access Private
  async getCart(id: number, session: any) {
    console.log('Product id', id);
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
        },
      });

      if (!existingUser)
        throw new NotFoundException(`Account ${session.email} not found!`);

      const existingCart = existingUser.cart.cartProducts;
      if (!existingCart) throw new NotFoundException('No cart record found!');

      const cartProducts = existingCart.map((product) => {
        return {
          name: product.product.title,
          price: product.product.price,
          quatity: product.quantity,
        };
      });

      const totalCartPrice = cartProducts.reduce((total, item) => {
        return total + Number(item.price) * item.quatity;
      }, 0);

      const totalCartQty = cartProducts.reduce((total, item) => {
        return total + item.quatity;
      }, 0);

      console.log('This is the total cart price', totalCartPrice);
      console.log('This is the total cart quantity', totalCartQty);

      return {
        status: 'success',
        msg: 'Cart info',
        data: {
          products: cartProducts,
          totalCartQty,
          totalPrice: totalCartPrice,
        },
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
  async updateCart(dto: UpdateCartDto, session: any) {
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

  // @route DELETE api/admin/get_user_by_acct_id
  // @desc To update user by account ID
  // @access Private
  async deleteCartItem(prodId: string, session: any) {
    try {
      console.log('Product id', prodId);
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
      console.log('This is the product...', existingUser);

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
          uuid: prodId,
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

      await this.prisma.cartProducts.delete({
        where: {
          productId_cartId: {
            productId: product.id,
            cartId: existingUser.cart.id,
          },
        },
      });
      console.log('This line was accessed bray!');

      return {
        status: 'success',
        msg: `Cart item ${product.title} deleted`,
        // data: existingCartProd,
      };
    } catch (error) {
      throw error;
    } finally {
      await this.prisma.$disconnect(); // Disconnect the Prisma client
    }
  }
}
