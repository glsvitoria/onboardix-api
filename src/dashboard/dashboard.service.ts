import { Injectable } from '@nestjs/common';
import { DashboardRepository } from './repositories/dashboard.repository';
import { UsersRepository } from '@/users/repositories/users.repository';
import { TemplatesRepository } from '@/templates/repositories/template.repository';
import { EmployeesResumePaginationDto } from './dto/employees-resume-pagination.dto';

@Injectable()
export class DashboardService {
  constructor(
    private readonly dashboardRepository: DashboardRepository,
    private readonly templatesRepository: TemplatesRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async employeesResume(
    employeesResumePaginationDto: EmployeesResumePaginationDto,
  ) {
    const { employees } =
      await this.dashboardRepository.findOrganizationMembersWithTasks(
        employeesResumePaginationDto,
      );

    if (employees.length === 0) {
      return {
        totalEmployees: 0,
        averageProgress: 0,
        employees: [],
      };
    }

    let totalProgressSum = 0;

    const report = employees.map((emp) => {
      const totalTasks = emp.assignedTasks.length;
      const completedTasks = emp.assignedTasks.filter(
        (t) => t.completedAt,
      ).length;

      const progressValue =
        totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      totalProgressSum += progressValue;

      return {
        id: emp.id,
        name: emp.fullName,
        email: emp.email,
        progress: `${progressValue}%`,
        progressValue,
        status: progressValue === 100 ? 'COMPLETED' : 'IN_PROGRESS',
      };
    });

    return {
      totalEmployees: report.length,
      averageProgress: Math.round(totalProgressSum / report.length),
      employees: report,
    };
  }

  async getGeneralStats(orgId: string) {
    const [stats, avgProgress, history] = await Promise.all([
      this.dashboardRepository.getOrgStats(orgId),
      this.dashboardRepository.getAverageProgress(orgId),
      this.dashboardRepository.getCompletionHistory(orgId),
    ]);

    return {
      cards: {
        totalEmployees: stats.totalEmployees,
        avgProgress: `${avgProgress}%`,
        completionRate:
          stats.completedTasks + stats.pendingTasks > 0
            ? Math.round(
                (stats.completedTasks /
                  (stats.completedTasks + stats.pendingTasks)) *
                  100,
              )
            : 0,
      },
      charts: {
        taskDistribution: [
          { name: 'Concluídas', value: stats.completedTasks },
          { name: 'Pendentes', value: stats.pendingTasks },
        ],
        history,
      },
    };
  }

  async globalSearch(orgId: string, query: string) {
    const [employees, templates] = await Promise.all([
      this.usersRepository.searchByName(query, orgId),
      this.templatesRepository.searchByName(query, orgId),
    ]);

    return {
      results: [
        ...employees.map((e) => ({
          id: e.id,
          name: e.fullName,
          type: 'USER',
        })),
        ...templates.map((t) => ({
          id: t.id,
          name: t.title,
          type: 'TEMPLATE',
        })),
      ],
    };
  }
}
