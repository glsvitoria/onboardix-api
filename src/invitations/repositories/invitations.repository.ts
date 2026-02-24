import { Invitation, Prisma, User } from '@/generated/prisma/client';

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
  abstract createUser(
    data: Prisma.UserCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<User>;
}
