import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';
import { LeadsRepository } from './leads.repository';

@Injectable()
export class PrismaLeadsRepository implements LeadsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(email: string) {
    return this.prisma.lead.create({
      data: {
        email,
      },
    });
  }
}
