import { PrismaService } from '@/database/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}

  async assignTemplate(userId: string, templateId: string, orgId: string) {
    // 1. Verificar se o template existe e pertence à mesma organização
    const template = await this.prisma.template.findFirst({
      where: { id: templateId, organizationId: orgId },
      include: { tasks: true },
    });

    if (!template) throw new NotFoundException('Template não encontrado');

    // 2. Criar as tarefas de progresso para o colaborador (UserTask)
    // Usamos createMany para performance
    const userTasks = template.tasks.map((task) => ({
      userId: userId,
      taskId: task.id,
    }));

    return this.prisma.userTask.createMany({
      data: userTasks,
      skipDuplicates: true, // Evita erro se o template já foi atribuído
    });
  }

  async getEmployeeProgress(userId: string) {
    const tasks = await this.prisma.userTask.findMany({
      where: { userId },
      include: { task: true },
    });

    const total = tasks.length;
    const completed = tasks.filter((t) => t.completedAt !== null).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      percentage,
      total,
      completed,
      tasks,
    };
  }
}
