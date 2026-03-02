import { Organization, Prisma } from '@/generated/prisma/client';

export abstract class OrganizationsRepository {
  abstract create(
    data: Prisma.OrganizationCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<Organization>;
  abstract findById(id: string, userId?: string): Promise<Organization | null>;
  abstract findBySlug(slug: string): Promise<Organization | null>;
}
