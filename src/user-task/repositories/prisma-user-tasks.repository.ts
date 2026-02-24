import { PrismaService } from '@/database/prisma/prisma.service';
import { UserTasksRepository } from './user-tasks.repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaUserTasksRepository implements UserTasksRepository {
  constructor(private prisma: PrismaService) {}

  async findByUserId(userId: string) {
    return await this.prisma.userTask.findMany({
      where: { userId },
      include: {
        task: {
          select: { title: true, content: true, link: true, order: true },
        },
      },
      orderBy: { task: { order: 'asc' } },
    });
  }

  async findByIds(userId: string, taskId: string) {
    return await this.prisma.userTask.findUnique({
      where: { userId_taskId: { userId, taskId } },
    });
  }

  async updateStatus(userId: string, taskId: string, completed: boolean) {
    return await this.prisma.userTask.update({
      where: { userId_taskId: { userId, taskId } },
      data: { completedAt: completed ? new Date() : null },
    });
  }
}
