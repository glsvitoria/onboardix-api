import { PrismaService } from '@/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getOrganizationStats(orgId: string) {
    // 1. Buscar todos os usuários da empresa que não foram deletados
    const employees = await this.prisma.user.findMany({
      where: {
        organizationId: orgId,
        role: 'MEMBER', // Geralmente gestores focam nos membros aqui
        deletedAt: null,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        assignedTasks: {
          select: {
            completedAt: true,
          },
        },
      },
    });

    // 2. Processar os dados para retornar métricas legíveis
    const report = employees.map((emp) => {
      const totalTasks = emp.assignedTasks.length;
      const completedTasks = emp.assignedTasks.filter(
        (t) => t.completedAt,
      ).length;
      const progress =
        totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      return {
        id: emp.id,
        name: emp.fullName,
        email: emp.email,
        progress: `${progress}%`,
        status: progress === 100 ? 'COMPLETED' : 'IN_PROGRESS',
      };
    });

    return {
      totalEmployees: report.length,
      averageProgress:
        report.reduce((acc, curr) => acc + parseInt(curr.progress), 0) /
          report.length || 0,
      employees: report,
    };
  }
}
