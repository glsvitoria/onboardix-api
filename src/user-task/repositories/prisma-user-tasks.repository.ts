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

  async findById(userTaskId: string, userId: string) {
    return await this.prisma.userTask.findFirst({
      where: { id: userTaskId, userId },
    });
  }

  async updateStatus(userTaskId: string, userId: string, completed: boolean) {
    return await this.prisma.userTask.update({
      where: { id: userTaskId, userId },
      data: { completedAt: completed ? new Date() : null },
    });
  }
}
