import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';
import { DashboardRepository } from './dashboard.repository';
import { EmployeesResumePaginationDto } from '../dto/employees-resume-pagination.dto';
import { UserWithTaskCompletedCountEntity } from '@/users/entity/user-with-task-completed-count';

@Injectable()
export class PrismaDashboardRepository implements DashboardRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOrganizationMembersWithTasks(
    employeesResumePaginationDto: EmployeesResumePaginationDto,
  ) {
    const [employees, total] = await Promise.all([
      await this.prisma.user.findMany({
        where: {
          role: 'MEMBER',
          ...employeesResumePaginationDto.where(),
        },
        select: {
          id: true,
          fullName: true,
          email: true,
          assignedTasks: {
            select: { completedAt: true },
          },
        },
        ...employeesResumePaginationDto.pagination(),
        orderBy: {
          [employeesResumePaginationDto.sort]: 'desc',
        },
      }),
      await this.prisma.user.count({
        where: {
          role: 'MEMBER',
          ...employeesResumePaginationDto.where(),
        },
        ...employeesResumePaginationDto.pagination(),
        orderBy: {
          [employeesResumePaginationDto.sort]: 'desc',
        },
      }),
    ]);

    return {
      employees: employees.map(
        (employee) => new UserWithTaskCompletedCountEntity(employee),
      ),
      total,
    };
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
    const users = await this.prisma.user.findMany({
      where: {
        organizationId: orgId,
        role: 'MEMBER',
      },
      select: {
        assignedTasks: true,
      },
    });

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
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - 7);
    startDate.setHours(0, 0, 0, 0);

    const result = await this.prisma.userTask.findMany({
      where: {
        user: { organizationId: orgId, role: 'MEMBER' },
        completedAt: { gte: startDate },
      },
      select: { completedAt: true },
      orderBy: { completedAt: 'asc' },
    });

    const countsByDay = result.reduce(
      (acc, task) => {
        if (task.completedAt) {
          const dateKey = task.completedAt.toISOString().split('T')[0];

          acc[dateKey] = (acc[dateKey] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>,
    );

    const history: {
      date: Date;
      count: number;
    }[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];

      history.push({
        date,
        count: countsByDay[dateKey] || 0,
      });
    }

    return history;
  }
}
