import { SetMetadata } from '@nestjs/common';

export const Roles = (...validRoles: string[]) => {
  return SetMetadata('roles', validRoles);
};
