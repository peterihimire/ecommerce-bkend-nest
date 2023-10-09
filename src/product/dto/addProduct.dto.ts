import {
  IsNotEmpty,
  IsNumber,
  // IsString,
} from 'class-validator';

export class AddProductDto {
  @IsNumber()
  @IsNotEmpty()
  productId: string;
}
