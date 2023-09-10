import { Injectable } from '@nestjs/common';
// import { PrismaService } from 'src/prisma/prisma.service';
// import { AuthDto } from './dto';
// import * as argon from 'argon2';
// import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
// import { JwtService } from '@nestjs/jwt';
// import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor() {}

  async dashboard() {
    try {
      return {
        msg: 'Dashboard success',
      };
    } catch (error) {
      throw error;
    }
  }
}
