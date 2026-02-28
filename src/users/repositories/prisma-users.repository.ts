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

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string, orgId?: string) {
    return await this.prisma.user.findUnique({
      where: { id, organizationId: orgId },
      include: { organization: true },
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
