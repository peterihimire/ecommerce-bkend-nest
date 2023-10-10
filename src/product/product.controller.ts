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
import { RoleExceptionFilter } from 'src/exception';

// @UseGuards(JwtGuard) //parent route
@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Roles('admin', 'moderator')
  @UseFilters(RoleExceptionFilter)
  @UseGuards(AuthenticatedGuard, RoleGuard) //individual route
  @Post('add_product')
  addProduct(@Body() dto: AddProductDto) {
    // console.log('This is user object...', user);
    console.log('This is the add product body...', dto);
    return this.productService.addProduct(dto);
  }

  @Roles('admin', 'moderator', 'user')
  @UseFilters(RoleExceptionFilter)
  @UseGuards(AuthenticatedGuard, RoleGuard) //individual route
  @Get('get_product/:id')
  getproduct(@Param('id') id: number, @GetUser() user: User) {
    console.log('This is user object...', user);
    console.log('This is the id parameter...', id);
    return this.productService.getProduct(id);
  }
}
