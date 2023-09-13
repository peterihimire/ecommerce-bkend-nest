import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
// import { AuthDto } from './dto';

@UseGuards(JwtGuard) //general route
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  // @UseGuards(JwtGuard) //individual route
  @Get('dashboard')
  dashboard(@GetUser() user: User) {
    console.log('This is user object...', user);
    // return this.userService.dashboard();
    return user;
  }
}
