import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  register() {
    return { msg: 'Registration success' };
  }
  login() {
    return { msg: 'Registration success' };
  }
}
