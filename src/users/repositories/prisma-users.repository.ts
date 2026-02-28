import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';
import { Prisma, User } from '@/generated/prisma/client';
import { UsersRepository } from './users.repository';

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    data: Prisma.UserCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<User> {
    const client = tx ?? this.prisma;

    return await client.user.create({ data });
  }

  async findByEmail(email: string, orgId?: string) {
    return await this.prisma.user.findFirst({
      where: { email, organizationId: orgId },
    });
  }

  async findById(id: string, orgId: string) {
    return await this.prisma.user.findFirst({
      where: { id, organizationId: orgId },
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return await this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async searchByName(name: string, orgId: string) {
    return await this.prisma.user.findMany({
      where: {
        organizationId: orgId,
        fullName: { contains: name, mode: 'insensitive' },
      },
      select: { id: true, fullName: true },
      take: 5,
    });
  }
}
