import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('api/ecommerce/v1/auth/')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: AuthDto) {
    console.log('This is dto...', dto);
    return this.authService.register();
  }

  @Post('login')
  login() {
    return this.authService.login();
  }
}
