import {
  Controller,
  Get,
  Patch,
  UseGuards,
  UseFilters,
  Post,
  Delete,
  Body,
  Param,
  Session,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthenticatedGuard, RoleGuard } from 'src/auth/guard';
import { GetUser, Roles } from 'src/auth/decorator';
import { AddToCartDto, UpdateCartDto } from './dto';
import {
  User,
  // Cart
} from '@prisma/client';
import { HttpExceptionFilter } from 'src/exception';

// @UseGuards(JwtGuard) //parent route
@Controller('carts')
export class CartController {
  constructor(private cartService: CartService) {}

  @Post('add_to_cart')
  @Roles('admin', 'moderator', 'user')
  @UseFilters(HttpExceptionFilter)
  @UseGuards(AuthenticatedGuard, RoleGuard)
  addToCart(
    @Session() session: Record<string, any>,
    @Body() dto: AddToCartDto,
    // @GetUser() user: User,
  ) {
    console.log('This is the session data...', session.user.data);
    const sess = session.user.data;
    return this.cartService.addToCart(dto, sess);
  }

  @Roles('admin', 'moderator', 'user')
  @UseFilters(HttpExceptionFilter)
  @UseGuards(AuthenticatedGuard, RoleGuard) //individual route
  @Get('get_cart')
  getCart(
    @Session() session: Record<string, any>,
    @Param('id') id: number,
    @GetUser() user: User,
  ) {
    console.log('This is user object...', user);
    console.log('This is the id parameter...', id);
    const sess = session.user.data;
    return this.cartService.getCart(id, sess);
  }

  @Roles('admin', 'moderator', 'user')
  @UseFilters(HttpExceptionFilter)
  @UseGuards(AuthenticatedGuard, RoleGuard) //individual route
  @Patch('update_cart')
  updateCart(
    @Session() session: Record<string, any>,
    @Body() dto: UpdateCartDto,
    @Param('prodId') prodId: string,
    @GetUser() user: User,
  ) {
    console.log('This is user object...', user);
    console.log('This is the id parameter...', prodId);
    const sess = session.user.data;
    return this.cartService.updateCart(dto, sess);
  }

  @Roles('admin', 'moderator', 'user')
  @UseFilters(HttpExceptionFilter)
  @UseGuards(AuthenticatedGuard, RoleGuard) //individual route
  @Delete('delete_cart_product')
  deleteCartItem(
    @Session() session: Record<string, any>,
    @Param('prodId') prodId: string,
    @GetUser() user: User,
  ) {
    console.log('This is user object...', user);
    console.log('This is the id parameter...', prodId);
    const sess = session.user.data;
    return this.cartService.deleteCartItem(prodId, sess);
  }
}
