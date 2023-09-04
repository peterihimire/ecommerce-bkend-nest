import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  register() {
    return { msg: 'Registration success' };
  }
  login() {
    return { msg: 'Registration success' };
  }
}
