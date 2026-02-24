import { UserRole } from '@/generated/prisma/enums';

export interface JWTPayload {
  email: string;
  orgId: string;
  role: UserRole;
  sub: string;
}
