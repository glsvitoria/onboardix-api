import { PrismaService } from '@/database/prisma/prisma.service';
import { UserTasksRepository } from './user-tasks.repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaUserTasksRepository implements UserTasksRepository {
  constructor(private prisma: PrismaService) {}

  async findByUserId(userId: string, organizationId: string) {
    return await this.prisma.userTask.findMany({
      where: {
        userId,
        user: {
          organizationId,
        },
      },
      include: {
        task: true,
      },
      orderBy: { task: { order: 'asc' } },
    });
  }

  async findById(userTaskId: string, userId: string, organizationId: string) {
    return await this.prisma.userTask.findFirst({
      where: {
        id: userTaskId,
        userId,
        user: {
          organizationId,
        },
      },
    });
  }

  async findByTaskId(taskId: string, userId: string, organizationId: string) {
    return await this.prisma.userTask.findFirst({
      where: {
        userId,
        taskId,
        user: {
          organizationId,
        },
      },
    });
  }

  async updateStatus(userTaskId: string, userId: string, completed: boolean) {
    return await this.prisma.userTask.update({
      where: { id: userTaskId, userId },
      data: { completedAt: completed ? new Date() : null },
    });
  }
}
