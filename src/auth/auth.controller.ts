import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, RegDto } from './dto';
// import { AuthGuard } from '@nestjs/passport';
import { LocalGuard } from './guard/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegDto) {
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
    req.session.user = req.user;
    // console.log('This is the user mfk...', req.session.user);
    return req.user;
  }

  //Get / logout
  // @UseGuards(LocalGuard)
  @Post('signout')
  signout(@Request() req) {
    req.session.destroy();

    return {
      status: 'success',
      msg: 'Logout successful!',
    };
  }
}
