import { Controller, Get, UseGuards, UseFilters } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthenticatedGuard, RoleGuard } from 'src/auth/guard';
import { GetUser, Roles } from 'src/auth/decorator';
import { User } from '@prisma/client';
import {
  // RoleExceptionFilter,
  HttpExceptionFilter,
} from 'src/exception';
// import { AuthDto } from './dto';
// import { JwtGuard } from 'src/auth/guard';

// @UseGuards(JwtGuard) //parent route
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Roles('admin', 'moderator')
  @UseFilters(HttpExceptionFilter)
  @UseGuards(AuthenticatedGuard, RoleGuard) //individual route
  @Get('profile')
  profile(@GetUser() user: User) {
    console.log('This is user object...', user);
    return this.userService.profile(user);
    // return user;
  }
}
