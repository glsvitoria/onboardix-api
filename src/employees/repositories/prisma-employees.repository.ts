import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';
import { Prisma } from '@/generated/prisma/client';
import { EmployeesRepository } from './employees.repository';
import { FindAllPaginationDto } from '../dto/find-all-pagination.dto';

@Injectable()
export class PrismaEmployeesRepository implements EmployeesRepository {
  constructor(private prisma: PrismaService) {}

  async assignTasks(data: Prisma.UserTaskCreateManyInput[]) {
    return await this.prisma.userTask.createMany({
      data,
      skipDuplicates: true,
    });
  }

  async findAllWithUserTasks(findAllPaginationDto: FindAllPaginationDto) {
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        ...findAllPaginationDto.pagination(),
        where: {
          ...findAllPaginationDto.where(),
          role: 'MEMBER',
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
          role: 'MEMBER',
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

  async updateTaskStatus(userId: string, taskId: string, completed: boolean) {
    await this.prisma.userTask.updateMany({
      where: {
        userId,
        taskId,
      },
      data: {
        completedAt: completed ? new Date() : null,
      },
    });
  }
}
