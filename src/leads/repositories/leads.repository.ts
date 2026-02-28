import { Lead } from '@/generated/prisma/client';

export abstract class LeadsRepository {
  abstract create(email: string): Promise<Lead>;
}
