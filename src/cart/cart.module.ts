import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { UnauthenticatedGuard } from 'src/auth/guard';

@Module({
  controllers: [CartController],
  providers: [CartService, UnauthenticatedGuard],
  exports: [UnauthenticatedGuard],
})
export class CartModule {}
