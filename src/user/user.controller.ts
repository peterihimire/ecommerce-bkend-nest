import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
// import { AuthDto } from './dto';

@Controller('api/ecommerce/v1/user/')
export class AuthController {
  constructor(private userService: UserService) {}

  @Get('dashboard')
  register() {
    // console.log('This is dto...', dto);
    return this.userService.dashboard();
  }
}
