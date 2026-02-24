import { Injectable } from '@nestjs/common';
import { Prisma, Template, Task } from '@/generated/prisma/client';
import { PrismaService } from '@/database/prisma/prisma.service';
import { TemplatesRepository } from './template.repository';

// Tipo auxiliar para retornos que incluem as tarefas
export type TemplateWithTasks = Template & { tasks: Task[] };

@Injectable()
export class PrismaTemplatesRepository implements TemplatesRepository {
  constructor(private prismaService: PrismaService) {}

  async create(data: Prisma.TemplateCreateInput): Promise<TemplateWithTasks> {
    return await this.prismaService.template.create({
      data,
      include: { tasks: true },
    });
  }

  async findAll(organizationId: string) {
    const [templates, total] = await Promise.all([
      this.prismaService.template.findMany({
        where: {
          organizationId,
          deletedAt: null, // Garante que não listamos templates deletados
        },
        include: {
          _count: {
            select: { tasks: true },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prismaService.template.count({
        where: {
          organizationId,
          deletedAt: null,
        },
      }),
    ]);

    return {
      templates,
      total,
    };
  }

  async findById(
    id: string,
    organizationId: string,
  ): Promise<TemplateWithTasks | null> {
    return await this.prismaService.template.findFirst({
      where: {
        id,
        organizationId,
        deletedAt: null,
      },
      include: {
        tasks: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async update(
    id: string,
    organizationId: string,
    data: Prisma.TemplateUpdateInput,
  ): Promise<TemplateWithTasks> {
    return await this.prismaService.template.update({
      where: {
        id,
        organizationId,
      },
      data,
      include: { tasks: true },
    });
  }

  async delete(id: string): Promise<Template> {
    // Implementação de Soft Delete para manter integridade de dados históricos
    return await this.prismaService.template.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
