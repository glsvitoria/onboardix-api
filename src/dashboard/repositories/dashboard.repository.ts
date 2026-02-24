import { User } from '@/generated/prisma/client';

export abstract class DashboardRepository {
  abstract findOrganizationMembersWithTasks(
    orgId: string,
  ): Promise<UserWithTaskCount[]>;
  abstract getOrgStats(orgId: string): Promise<{
    totalEmployees: number;
    completedTasks: number;
    pendingTasks: number;
  }>;
  abstract getAverageProgress(orgId: string): Promise<number>;
  abstract getCompletionHistory(
    orgId: string,
  ): Promise<{ day: Date; count: number }[]>;
}

export type UserWithTaskCount = Pick<User, 'id' | 'fullName' | 'email'> & {
  assignedTasks: {
    completedAt: Date | null;
  }[];
};
