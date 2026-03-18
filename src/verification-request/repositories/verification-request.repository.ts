import { Prisma, VerificationRequest, VerificationType } from '@/generated/prisma/client';

export abstract class VerificationRequestsRepository {
  abstract create(
    data: Prisma.VerificationRequestCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<VerificationRequest>;

  abstract findByIdentifier(
    identifier: string,
    type: VerificationType,
  ): Promise<VerificationRequest | null>;

  abstract update(
    id: string,
    data: Prisma.VerificationRequestUpdateInput,
  ): Promise<VerificationRequest>;

  abstract delete(id: string): Promise<void>;
}
