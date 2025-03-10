import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/enum/userRole';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
