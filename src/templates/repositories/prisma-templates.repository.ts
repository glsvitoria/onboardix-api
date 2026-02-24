import { Injectable } from '@nestjs/common';
import { Prisma, Template } from '@/generated/prisma/client';
import { PrismaService } from '@/database/prisma/prisma.service';
import { TemplatesRepository } from './template.repository';
import { FindAllPaginationDto } from '../dto/find-all-pagination.dto';

@Injectable()
export class PrismaTemplatesRepository implements TemplatesRepository {
  constructor(private prismaService: PrismaService) {}

  async create(data: Prisma.TemplateCreateInput) {
    return await this.prismaService.template.create({
      data,
      include: { tasks: true },
    });
  }

  async delete(id: string): Promise<Template> {
    return await this.prismaService.template.delete({
      where: { id },
    });
  }

  async findAll(findAllPaginationDto: FindAllPaginationDto) {
    const [templates, total] = await Promise.all([
      this.prismaService.template.findMany({
        ...findAllPaginationDto.pagination(),
        where: {
          ...findAllPaginationDto.where(),
        },
        include: {
          _count: {
            select: {
              tasks: true,
            },
          },
        },
        orderBy: {
          [findAllPaginationDto.sort]: 'desc',
        },
      }),
      this.prismaService.template.count({
        where: {
          ...findAllPaginationDto.where(),
        },
        orderBy: {
          [findAllPaginationDto.sort]: 'desc',
        },
      }),
    ]);

    return {
      templates,
      total,
    };
  }

  async findById(id: string, organizationId: string) {
    return await this.prismaService.template.findFirst({
      where: {
        id,
        organizationId,
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
  ) {
    return await this.prismaService.template.update({
      where: {
        id,
        organizationId,
      },
      data,
      include: { tasks: true },
    });
  }
}
