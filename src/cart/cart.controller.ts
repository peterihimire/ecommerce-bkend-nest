import {
  Controller,
  Get,
  UseGuards,
  UseFilters,
  Post,
  Body,
  Param,
  Session,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthenticatedGuard, RoleGuard } from 'src/auth/guard';
import { GetUser, Roles } from 'src/auth/decorator';
import { AddToCartDto } from './dto';
import {
  User,
  // Cart
} from '@prisma/client';
import { RoleExceptionFilter } from 'src/exception';

// @UseGuards(JwtGuard) //parent route
@Controller('carts')
export class CartController {
  constructor(private cartService: CartService) {}

  @Roles('admin', 'moderator', 'user')
  @UseFilters(RoleExceptionFilter)
  @UseGuards(AuthenticatedGuard, RoleGuard) //individual route
  @Post('add_to_cart')
  addToCart(
    @Session() session: Record<string, any>,
    @Body() dto: AddToCartDto,
    // @GetUser() user: User,
  ) {
    console.log('This is the session data...', session.user.data);
    const sess = session.user.data;
    // console.log('This is user object...', user);
    // console.log('This is the add to cart body...', dto);
    return this.cartService.addToCart(dto, sess);
  }

  @Roles('admin', 'moderator', 'user')
  @UseFilters(RoleExceptionFilter)
  @UseGuards(AuthenticatedGuard, RoleGuard) //individual route
  @Get('get_cart')
  getCart(@Param('id') id: number, @GetUser() user: User) {
    console.log('This is user object...', user);
    console.log('This is the id parameter...', id);
    return this.cartService.getCart(id);
  }
}
