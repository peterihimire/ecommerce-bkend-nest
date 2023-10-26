import {
  Controller,
  Get,
  Patch,
  UseGuards,
  UseFilters,
  Post,
  Body,
  Param,
  Session,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
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
export class TransactionController {
  constructor(private orderService: TransactionService) {}

  @Roles('admin', 'moderator', 'user')
  @UseFilters(HttpExceptionFilter)
  @UseGuards(AuthenticatedGuard, RoleGuard)
  @Post('create_order')
  createOrder(
    @Session() session: Record<string, any>,
    @Body() dto: CreateOrderDto,
    // @GetUser() user: User,
  ) {
    console.log('This is the session data...', session.user.data);
    const sess = session.user.data;
    return this.orderService.createOrder(dto, sess);
  }

  @Roles('admin', 'moderator', 'user')
  @UseFilters(HttpExceptionFilter)
  @UseGuards(AuthenticatedGuard, RoleGuard) //individual route
  @Get('get_order')
  getOrder(
    @Session() session: Record<string, any>,

    @GetUser() user: User,
  ) {
    console.log('This is user object...', user);

    const sess = session.user.data;
    return this.orderService.getOrder(sess);
  }

  @Roles('admin', 'moderator', 'user')
  @UseFilters(HttpExceptionFilter)
  @UseGuards(AuthenticatedGuard, RoleGuard) //individual route
  @Get('get_order/:orderId')
  getOrderById(
    @Session() session: Record<string, any>,
    @Param('orderId') orderId: string,
    @GetUser() user: User,
  ) {
    console.log('This is user object...', user);
    console.log('This is the id parameter...', orderId);
    const sess = session.user.data;
    return this.orderService.getOrderById(orderId, sess);
  }

  @Roles('admin', 'moderator', 'user')
  @UseFilters(HttpExceptionFilter)
  @UseGuards(AuthenticatedGuard, RoleGuard) //individual route
  @Patch('update_order')
  updateOrder(
    @Session() session: Record<string, any>,
    @Body() dto: UpdateOrderDto,
    @Param('prodId') prodId: string,
    @GetUser() user: User,
  ) {
    console.log('This is user object...', user);
    console.log('This is the id parameter...', prodId);
    const sess = session.user.data;
    return this.orderService.updateOrder(dto, sess);
  }
}
