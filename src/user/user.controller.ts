import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
// import { JwtGuard } from 'src/auth/guard';
import { AuthenticatedGuard } from 'src/auth/guard/authenticated.guard';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
// import { AuthDto } from './dto';

// @UseGuards(JwtGuard) //parent route
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthenticatedGuard) //individual route
  @Get('profile')
  profile(@GetUser() user: User) {
    console.log('This is user object...', user);
    return this.userService.profile(user);
    // return user;
  }
}
