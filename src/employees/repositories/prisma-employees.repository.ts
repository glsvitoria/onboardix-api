import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';
import { Prisma, User } from '@/generated/prisma/client';
import { EmployeesRepository } from './employees.repository';
import { FindAllPaginationDto } from '../dto/find-all-pagination.dto';

@Injectable()
export class PrismaEmployeesRepository implements EmployeesRepository {
  constructor(private prisma: PrismaService) {}

  async findTemplateWithTasks(templateId: string, orgId: string) {
    return await this.prisma.template.findFirst({
      where: {
        id: templateId,
        organizationId: orgId,
      },
      include: {
        tasks: {
          select: { id: true },
        },
      },
    });
  }

  async assignTasks(data: Prisma.UserTaskCreateManyInput[]) {
    return await this.prisma.userTask.createMany({
      data,
      skipDuplicates: true,
    });
  }

  async findUserTask(userId: string, taskId: string) {
    return await this.prisma.userTask.findFirst({
      where: { userId, taskId },
    });
  }

  async updateTaskStatus(userId: string, taskId: string, completed: boolean) {
    return await this.prisma.userTask.update({
      where: {
        userId_taskId: {
          // Chave composta se você definiu @@id([userId, taskId]) no schema
          userId,
          taskId,
        },
      },
      data: {
        completedAt: completed ? new Date() : null,
      },
    });
  }

  async findAllWithUserTasks(findAllPaginationDto: FindAllPaginationDto) {
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        ...findAllPaginationDto.pagination(),
        where: {
          ...findAllPaginationDto.where(),
        },
        include: {
          assignedTasks: {
            include: {
              task: true,
            },
            orderBy: {
              task: { order: 'asc' },
            },
          },
        },
        orderBy: {
          [findAllPaginationDto.sort]: 'desc',
        },
      }),
      this.prisma.user.count({
        where: {
          ...findAllPaginationDto.where(),
        },
        orderBy: {
          [findAllPaginationDto.sort]: 'desc',
        },
      }),
    ]);

    return {
      users,
      total,
    };
  }

  async findEmployeeDetail(userId: string, orgId: string) {
    return await this.prisma.user.findFirst({
      where: {
        id: userId,
        organizationId: orgId,
        deletedAt: null,
      },
      include: {
        assignedTasks: {
          include: {
            task: true,
          },
          orderBy: {
            task: { order: 'asc' },
          },
        },
      },
    });
  }
}
