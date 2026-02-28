import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { UserRole } from '@/generated/prisma/enums';
import { AccessTokenGuard } from '@/auth/guards/access-token.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';

export const ROLES_KEY = 'roles';

export function ProtectedRoles(...roles: UserRole[]) {
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    UseGuards(AccessTokenGuard, RolesGuard),
  );
}
