import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
// import { UserService } from 'src/user/user.service';
// import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor() {
    // private userService: UserService,// private prisma: PrismaService,
    super();
  }

  serializeUser(user: any, done: (err: Error, user: any) => void) {
    done(null, user);
  }

  async deserializeUser(
    payload: any,
    done: (err: Error, payload: string) => void,
  ) {
    done(null, payload);
  }
}
