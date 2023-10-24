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
import { OrderService } from './order.service';
import { AuthenticatedGuard, RoleGuard } from 'src/auth/guard';
import { GetUser, Roles } from 'src/auth/decorator';
import { CreateOrderDto, UpdateOrderDto } from './dto';
import {
  User,
  // Cart
} from '@prisma/client';
import { HttpExceptionFilter } from 'src/exception';

// @UseGuards(JwtGuard) //parent route
@Controller('orders')
export class OrderController {
  constructor(private cartService: OrderService) {}

  @Post('create_order')
  @Roles('admin', 'moderator', 'user')
  @UseFilters(HttpExceptionFilter)
  @UseGuards(AuthenticatedGuard, RoleGuard)
  createOrder(
    @Session() session: Record<string, any>,
    @Body() dto: CreateOrderDto,
    // @GetUser() user: User,
  ) {
    console.log('This is the session data...', session.user.data);
    const sess = session.user.data;
    return this.cartService.createOrder(dto, sess);
  }

  @Roles('admin', 'moderator', 'user')
  @UseFilters(HttpExceptionFilter)
  @UseGuards(AuthenticatedGuard, RoleGuard) //individual route
  @Get('get_order')
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
  @Patch('update_order')
  updateCart(
    @Session() session: Record<string, any>,
    @Body() dto: UpdateOrderDto,
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
  @Delete('delete_order_item/:prodId')
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
