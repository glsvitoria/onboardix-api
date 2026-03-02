import { User, Prisma } from '@/generated/prisma/client';

export abstract class UsersRepository {
  abstract create(
    data: Prisma.UserCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<User>;
  abstract findByEmail(email: string, orgId?: string): Promise<User | null>;
  abstract findById(id: string, orgId?: string): Promise<User | null>;
  abstract update(id: string, data: Prisma.UserUpdateInput): Promise<User>;
  abstract searchByName(
    name: string,
    orgIg: string,
  ): Promise<Pick<User, 'id' | 'fullName'>[]>;
}
