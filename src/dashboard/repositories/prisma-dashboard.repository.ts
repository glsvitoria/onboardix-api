import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';
import { DashboardRepository, UserWithTaskCount } from './dashboard.repository';

@Injectable()
export class PrismaDashboardRepository implements DashboardRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOrganizationMembersWithTasks(
    orgId: string,
  ): Promise<UserWithTaskCount[]> {
    return this.prisma.user.findMany({
      where: { organizationId: orgId, role: 'MEMBER' },
      select: {
        id: true,
        fullName: true,
        email: true,
        assignedTasks: {
          select: { completedAt: true },
        },
      },
    });
  }

  async getOrgStats(orgId: string) {
    const [totalEmployees, completedTasks, totalTasks] = await Promise.all([
      this.prisma.user.count({
        where: { organizationId: orgId, role: 'MEMBER' },
      }),
      this.prisma.userTask.count({
        where: {
          user: { organizationId: orgId, role: 'MEMBER' },
          completedAt: { not: null },
        },
      }),
      this.prisma.userTask.count({
        where: { user: { organizationId: orgId, role: 'MEMBER' } },
      }),
    ]);

    return {
      totalEmployees,
      completedTasks,
      pendingTasks: totalTasks - completedTasks,
    };
  }

  async getAverageProgress(orgId: string): Promise<number> {
    const users = await this.findOrganizationMembersWithTasks(orgId);

    if (users.length === 0) return 0;

    const progresses = users.map((emp) => {
      const total = emp.assignedTasks.length;
      const completed = emp.assignedTasks.filter((t) => t.completedAt).length;
      return total > 0 ? (completed / total) * 100 : 0;
    });

    const sum = progresses.reduce((a, b) => a + b, 0);
    return Math.round(sum / users.length);
  }

  async getCompletionHistory(orgId: string) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const result = await this.prisma.userTask.findMany({
      where: {
        user: { organizationId: orgId, role: 'MEMBER' },
        completedAt: { gte: sevenDaysAgo },
      },
      select: { completedAt: true },
      orderBy: { completedAt: 'asc' },
    });

    // Pequeno ajuste para formatar os dados de data para o Service
    return result.map((r) => ({
      day: r.completedAt!,
      count: 1,
    }));
  }
}
