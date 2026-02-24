import { Organization, Prisma, User } from '@/generated/prisma/client';

export abstract class OrganizationsRepository {
  abstract create(
    data: Prisma.OrganizationCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<Organization>;
  abstract findBySlug(slug: string): Promise<Organization | null>;
  abstract createOwner(
    data: Prisma.UserCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<User>;
}
