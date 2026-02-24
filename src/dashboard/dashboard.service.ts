import { Injectable } from '@nestjs/common';
import { DashboardRepository } from './repositories/dashboard.repository';

@Injectable()
export class DashboardService {
  constructor(private readonly dashboardRepository: DashboardRepository) {}

  async getOrganizationStats(orgId: string) {
    const employees =
      await this.dashboardRepository.findOrganizationMembersWithTasks(orgId);

    if (!employees || employees.length === 0) {
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
      totalProgressSum += progressValue; // Soma o valor numérico diretamente

      return {
        id: emp.id,
        name: emp.fullName,
        email: emp.email,
        progress: `${progressValue}%`,
        progressValue, // Útil para ordenação no frontend
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

    const historyGrouped = history.reduce(
      (acc, curr) => {
        const dateKey = new Date(curr.day).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
        });

        acc[dateKey] = (acc[dateKey] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const recentActivity = Object.entries(historyGrouped).map(
      ([date, count]) => ({
        date,
        count,
      }),
    );

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
        recentActivity, // Agora retorna: [{ date: '24/02', count: 5 }, ...]
      },
    };
  }
}
