import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateCartDto {
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  productId: string;
}
