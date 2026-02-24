import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTemplateDto } from './dto/create-template.dto';
import { TemplatesRepository } from './repositories/template.repository';
import { UpdateTemplateDto } from './dto/update-template.dto';

@Injectable()
export class TemplatesService {
  constructor(private templatesRepository: TemplatesRepository) {}

  async create(dto: CreateTemplateDto, organizationId: string) {
    return this.templatesRepository.create({
      title: dto.title,
      description: dto.description,
      organization: { connect: { id: organizationId } },
      tasks: {
        create: dto.tasks.map((task, index) => ({
          title: task.title,
          content: task.content,
          order: index,
        })),
      },
    });
  }

  async findAll(organizationId: string) {
    return this.templatesRepository.findAll(organizationId);
  }

  async findOne(id: string, organizationId: string) {
    const template = await this.templatesRepository.findById(
      id,
      organizationId,
    );
    if (!template) throw new NotFoundException('Template não encontrado');
    return template;
  }

  async update(id: string, organizationId: string, dto: UpdateTemplateDto) {
    await this.findOne(id, organizationId);

    return this.templatesRepository.update(id, organizationId, {
      title: dto.title,
      description: dto.description,
      tasks: dto.tasks
        ? {
            deleteMany: {},
            create: dto.tasks.map((task, index) => ({
              title: task.title,
              content: task.content,
              order: index,
            })),
          }
        : undefined,
    });
  }

  async remove(id: string, organizationId: string) {
    await this.findOne(id, organizationId);
    return this.templatesRepository.delete(id);
  }
}
