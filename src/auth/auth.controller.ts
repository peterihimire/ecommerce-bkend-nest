import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
// import { AuthGuard } from '@nestjs/passport';
import { LocalGuard } from './guard/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: AuthDto) {
    // console.log('This is dto...', dto);
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: AuthDto) {
    return this.authService.login(dto);
  }

  // @UseGuards(AuthGuard('local'))
  @UseGuards(LocalGuard)
  @Post('signin')
  signin(@Request() req) {
    // return {
    //   status: 'success',
    //   msg: 'you are signed in',
    // };
    return req.user;
  }
}
