import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';
import {
  Prisma,
  VerificationRequest,
  VerificationType,
} from '@/generated/prisma/client';
import { VerificationRequestsRepository } from './verification-request.repository';

@Injectable()
export class PrismaVerificationRequestsRepository implements VerificationRequestsRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    data: Prisma.VerificationRequestCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<VerificationRequest> {
    const client = tx ?? this.prisma;

    return await client.verificationRequest.create({ data });
  }

  async findByIdentifier(
    identifier: string,
    type: VerificationType,
  ): Promise<VerificationRequest | null> {
    return await this.prisma.verificationRequest.findFirst({
      where: {
        identifier,
        type,
      },
    });
  }

  async update(
    id: string,
    data: Prisma.VerificationRequestUpdateInput,
  ): Promise<VerificationRequest> {
    return await this.prisma.verificationRequest.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.verificationRequest.delete({
      where: { id },
    });
  }
}
