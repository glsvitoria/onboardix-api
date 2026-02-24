import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';
import { Prisma } from '@/generated/prisma/client';
import { InvitationsRepository } from './invitations.repository';

@Injectable()
export class PrismaInvitationsRepository implements InvitationsRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.InvitationCreateInput) {
    return await this.prisma.invitation.create({ data });
  }

  async findByToken(token: string) {
    return await this.prisma.invitation.findUnique({
      where: { token },
      include: { organization: { select: { name: true } } },
    });
  }

  async findByEmail(email: string) {
    return await this.prisma.invitation.findFirst({ where: { email } });
  }

  async delete(id: string, tx?: Prisma.TransactionClient) {
    const client = tx ?? this.prisma;
    return await client.invitation.delete({ where: { id } });
  }

  async createUser(
    data: Prisma.UserCreateInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;
    return await client.user.create({ data });
  }
}
