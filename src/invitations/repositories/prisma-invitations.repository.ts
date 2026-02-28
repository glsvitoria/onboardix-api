import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';
import { Prisma } from '@/generated/prisma/client';
import { InvitationsRepository } from './invitations.repository';
import { FindAllPaginationDto } from '../dto/find-all-pagination.dto';

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

  async findAll(findAllPaginationDto: FindAllPaginationDto) {
    const [invitations, total] = await Promise.all([
      this.prisma.invitation.findMany({
        ...findAllPaginationDto.pagination(),
        where: {
          ...findAllPaginationDto.where(),
        },
        orderBy: {
          [findAllPaginationDto.sort]: 'desc',
        },
      }),
      this.prisma.invitation.count({
        where: {
          ...findAllPaginationDto.where(),
        },
        orderBy: {
          [findAllPaginationDto.sort]: 'desc',
        },
      }),
    ]);

    return {
      invitations,
      total,
    };
  }
}
