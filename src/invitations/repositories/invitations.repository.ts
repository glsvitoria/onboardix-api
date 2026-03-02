import { Invitation, Prisma } from '@/generated/prisma/client';
import { FindAllPaginationDto } from '../dto/find-all-pagination.dto';

export abstract class InvitationsRepository {
  abstract create(data: Prisma.InvitationCreateInput): Promise<Invitation>;
  abstract findByToken(
    token: string,
  ): Promise<(Invitation & { organization: { name: string } }) | null>;
  abstract findByEmail(email: string): Promise<Invitation | null>;
  abstract delete(
    id: string,
    tx?: Prisma.TransactionClient,
  ): Promise<Invitation>;
  abstract findAll(
    findAllPaginationDto: FindAllPaginationDto,
  ): Promise<{ invitations: Invitation[]; total: number }>;
}
