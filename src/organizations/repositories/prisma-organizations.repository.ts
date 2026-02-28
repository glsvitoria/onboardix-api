import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';
import { Prisma } from '@/generated/prisma/client';
import { OrganizationsRepository } from './organizations.repository';

@Injectable()
export class PrismaOrganizationsRepository implements OrganizationsRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    data: Prisma.OrganizationCreateInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;
    return await client.organization.create({ data });
  }

  async findById(id: string) {
    return await this.prisma.organization.findFirst({ where: { id } });
  }

  async findBySlug(slug: string) {
    return await this.prisma.organization.findFirst({ where: { slug } });
  }
}
