import {
  Controller,
  Get,
  UseGuards,
  UseFilters,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthenticatedGuard, RoleGuard } from 'src/auth/guard';
import { GetUser, Roles } from 'src/auth/decorator';
import { AddProductDto, EditProductDto } from './dto';
import {
  User,
  // Cart
} from '@prisma/client';
import {
  HttpExceptionFilter,
  // RoleExceptionFilter,
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
  @UseFilters(HttpExceptionFilter)
  @UseGuards(AuthenticatedGuard, RoleGuard)
  getproducts() {
    return this.productService.getProducts();
  }

  // @UseFilters(RoleExceptionFilter)
  @Get('get_product/:id')
  @Roles('admin', 'moderator', 'user')
  @UseFilters(HttpExceptionFilter)
  @UseGuards(AuthenticatedGuard, RoleGuard)
  getproduct(@Param('id') id: string, @GetUser() user: User) {
    console.log('This is user object...', user);
    return this.productService.getProduct(id);
  }

  @Patch('edit_product/:id')
  @Roles('admin', 'moderator')
  @UseFilters(HttpExceptionFilter)
  @UseGuards(AuthenticatedGuard, RoleGuard)
  editproduct(@Param('id') id: string, @Body() dto: EditProductDto) {
    return this.productService.editProduct(id, dto);
  }

  @Delete('delete_product/:id')
  @Roles('admin', 'moderator')
  @UseFilters(HttpExceptionFilter)
  @UseGuards(AuthenticatedGuard, RoleGuard)
  deleteproduct(@Param('id') id: string) {
    return this.productService.deleteProduct(id);
  }
}
