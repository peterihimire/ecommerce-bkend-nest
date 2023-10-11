import {
  Injectable,
  ConflictException,
  // ForbiddenException, Logger
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AddProductDto } from './dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  // @route GET api/admin/get_user_by_acct_id
  // @desc To update user by account ID
  // @access Private
  async addProduct(dto: AddProductDto) {
    try {
      console.log('This is add-product dto  payload', dto);
      // Logger.verbose('This is user payload', user);

      const new_product = await this.prisma.product.create({
        data: {
          title: dto.title,
          slug: dto.slug,
          image: dto.image,
          color: dto.color,
          category: dto.category,
          price: dto.price,
          brand: dto.brand,
          countInStock: dto.countInStock,
          rating: dto.rating,
          desc: dto.desc,
          size: dto.size,
          numReviews: dto.numReviews,
          adminId: dto.adminId,
        },
      });

      return {
        status: 'success',
        msg: 'Product created',
        data: new_product,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            `Product title '${dto.title}' already exist!`,
          );
        }
      }
      throw error;
    }
  }

  // @route GET api/admin/get_user_by_acct_id
  // @desc To update user by account ID
  // @access Private
  async getProducts() {
    try {
      const all_products = await this.prisma.product.findMany();

      return {
        status: 'success',
        msg: 'All Products',
        data: all_products,
      };
    } catch (error) {
      throw error;
    }
  }

  // @route GET api/admin/get_user_by_acct_id
  // @desc To update user by account ID
  // @access Private
  async getProduct(id: number) {
    console.log('Product id', id);

    try {
      return {
        status: 'success',
        msg: 'Product info',
        // data: userWithRoleNames,
      };
    } catch (error) {
      throw error;
    }
  }
}
