import { Injectable } from '@nestjs/common';
import { CreateTemplateDto } from './dto/create-template.dto';
import { PrismaService } from '@/database/prisma/prisma.service';

@Injectable()
export class TemplatesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTemplateDto, organizationId: string) {
    return this.prisma.template.create({
      data: {
        title: dto.title,
        description: dto.description,
        organizationId: organizationId,
        tasks: {
          create: dto.tasks.map((task, index) => ({
            title: task.title,
            content: task.content,
            order: index, // Define a ordem automática baseada no array
          })),
        },
      },
      include: { tasks: true }, // Retorna o template com as tarefas criadas
    });
  }

  async findAll(organizationId: string) {
    return this.prisma.template.findMany({
      where: {
        organizationId,
        deletedAt: null, // Garante que não traz templates deletados
      },
      include: { _count: { select: { tasks: true } } }, // Mostra quantas tarefas tem
    });
  }
}
