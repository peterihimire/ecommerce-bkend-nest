import {
  IsNotEmpty,
  // IsNumber,
  IsString,
} from 'class-validator';

export class AddToCartDto {
  @IsString()
  @IsNotEmpty()
  productId: string;
}
