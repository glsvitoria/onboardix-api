import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';
import { Prisma, User } from '@/generated/prisma/client';
import { EmployeesRepository } from './employees.repository';

@Injectable()
export class PrismaEmployeesRepository implements EmployeesRepository {
  constructor(private prisma: PrismaService) {}

  async findUserById(userId: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { id: userId },
    });
  }
  
  // Ajustando o findTemplateWithTasks para garantir que as tasks venham com ID
  async findTemplateWithTasks(templateId: string, orgId: string) {
    return await this.prisma.template.findFirst({
      where: { 
        id: templateId, 
        organizationId: orgId,
        deletedAt: null 
      },
      include: {
        tasks: {
          select: { id: true }
        }
      }
    });
  }

  async assignTasks(data: Prisma.UserTaskCreateManyInput[]) {
    return await this.prisma.userTask.createMany({
      data,
      skipDuplicates: true,
    });
  }

  async findUserTasks(userId: string) {
    return await this.prisma.userTask.findMany({
      where: { userId },
      include: {
        task: {
          select: {
            title: true,
            content: true,
            order: true,
          },
        },
      },
      orderBy: {
        task: { order: 'asc' },
      },
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

  async findAllByOrg(orgId: string) {
    return await this.prisma.user.findMany({
      where: {
        organizationId: orgId,
        deletedAt: null,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true,
        assignedTasks: {
          select: {
            completedAt: true,
          },
        },
      },
      orderBy: { fullName: 'asc' },
    });
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
            task: {
              select: {
                title: true,
                content: true,
                order: true,
              },
            },
          },
          orderBy: {
            task: { order: 'asc' },
          },
        },
      },
    });
  }
}
