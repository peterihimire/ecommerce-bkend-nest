import {
  Controller,
  Get,
  UseGuards,
  UseFilters,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthenticatedGuard, RoleGuard } from 'src/auth/guard';
import { GetUser, Roles } from 'src/auth/decorator';
import { AddProductDto } from './dto';
import {
  User,
  // Cart
} from '@prisma/client';
import {
  RoleExceptionFilter,
  HttpExceptionFilter,
  // ForbiddenException,
} from 'src/exception';

// @UseGuards(JwtGuard) //parent route
@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post('add_product')
  @Roles('admin', 'moderator')
  @UseFilters(HttpExceptionFilter)
  @UseGuards(AuthenticatedGuard, RoleGuard) //individual route
  addProduct(@Body() dto: AddProductDto) {
    return this.productService.addProduct(dto);
  }

  @Get('get_products')
  @Roles('admin', 'moderator', 'user')
  @UseFilters(RoleExceptionFilter)
  @UseGuards(AuthenticatedGuard, RoleGuard)
  getproducts() {
    return this.productService.getProducts();
  }

  @Get('get_product/:id')
  @Roles('admin', 'moderator', 'user')
  @UseFilters(RoleExceptionFilter)
  @UseGuards(AuthenticatedGuard, RoleGuard)
  getproduct(@Param('id') id: number, @GetUser() user: User) {
    console.log('This is user object...', user);
    console.log('This is the id parameter...', id);
    return this.productService.getProduct(id);
  }
}
