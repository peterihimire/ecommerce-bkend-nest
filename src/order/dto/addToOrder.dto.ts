import { IsNotEmpty, IsString } from 'class-validator';

export class AddToOrderDto {
  @IsString()
  @IsNotEmpty()
  productId: string;
}
