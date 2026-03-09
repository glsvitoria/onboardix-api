import { PrismaService } from '@/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { RefreshTokensRepository } from './refresh-token';
import { RefreshToken } from '@/generated/prisma/client';
import { RefreshTokenCreateInput } from '@/generated/prisma/models';

@Injectable()
export class PrismaRefreshTokensRepository implements RefreshTokensRepository {
  constructor(private prismaService: PrismaService) {}

  async create(data: RefreshTokenCreateInput) {
    return await this.prismaService.refreshToken.create({
      data,
    });
  }

  async delete(refreshTokenId: string) {
    return await this.prismaService.refreshToken.delete({
      where: {
        id: refreshTokenId,
      },
    });
  }

  async deleteByUserId(userId: string) {
    return await this.prismaService.refreshToken.deleteMany({
      where: {
        userId,
      },
    });
  }

  async findByUserId(userId: string) {
    return await this.prismaService.refreshToken.findFirst({
      where: {
        userId,
      },
    });
  }
}
