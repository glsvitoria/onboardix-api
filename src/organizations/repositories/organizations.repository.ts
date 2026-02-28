import { Organization, Prisma, User } from '@/generated/prisma/client';

export abstract class OrganizationsRepository {
  abstract create(
    data: Prisma.OrganizationCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<Organization>;
  abstract findById(id: string): Promise<Organization | null>;
  abstract findBySlug(slug: string): Promise<Organization | null>;
}
