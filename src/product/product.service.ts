import {
  Injectable,
  ConflictException,
  // ForbiddenException, Logger
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddProductDto } from './dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async addProduct(dto: AddProductDto) {
    try {
      console.log('This is add-product dto  payload', dto);
      // // Logger.verbose('This is user payload', user);

      const existing_product = await this.prisma.product.findUnique({
        where: {
          title: dto.title,
        },
      });
      if (existing_product) {
        throw new ConflictException(
          `Product title ${dto.title} already exist!`,
        );
      }

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
      throw error;
    }
  }

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
