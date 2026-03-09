import { Prisma, RefreshToken } from '@/generated/prisma/client';

export abstract class RefreshTokensRepository {
  abstract create(data: Prisma.RefreshTokenCreateInput): Promise<RefreshToken>;
  abstract delete(refreshTokenId: string): Promise<RefreshToken | null>;
  abstract deleteByUserId(userId: string): Promise<{ count: number }>;
  abstract findByUserId(userId: string): Promise<RefreshToken | null>;
}
