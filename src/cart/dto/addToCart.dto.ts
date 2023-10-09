import {
  IsNotEmpty,
  IsNumber,
  // IsString,
} from 'class-validator';

export class AddToCartDto {
  @IsNumber()
  @IsNotEmpty()
  productId: string;
}
