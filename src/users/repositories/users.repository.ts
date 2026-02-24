import { User, Prisma } from '@/generated/prisma/client';

export abstract class UsersRepository {
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findById(id: string): Promise<User | null>;
  abstract create(
    data: Prisma.UserCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<User>;
  abstract update(id: string, data: Prisma.UserUpdateInput): Promise<User>;
  
}
