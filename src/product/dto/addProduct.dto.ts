import { IsNotEmpty, IsNumber, IsString, IsArray } from 'class-validator';

export class AddProductDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsArray()
  image: string[];

  @IsArray()
  @IsNotEmpty()
  color: string[];

  @IsArray()
  @IsNotEmpty()
  category: string[];

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsNumber()
  countInStock: number;

  @IsNumber()
  rating: number;

  @IsString()
  @IsNotEmpty()
  desc: string;

  @IsArray()
  @IsNotEmpty()
  size: string[];

  @IsString()
  numReviews: string;

  @IsNumber()
  @IsNotEmpty()
  adminId: number;
}
