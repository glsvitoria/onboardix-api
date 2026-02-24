import { UserRole } from '@/generated/prisma/enums';

export interface AuthenticatedUser {
  email: string;
  orgId: string;
  role: UserRole;
  sub: string;
}
