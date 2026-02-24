import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTemplateDto } from './dto/create-template.dto';
import { TemplatesRepository } from './repositories/template.repository';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { FindAllPaginationDto } from './dto/find-all-pagination.dto';
import { ErrorMessagesHelper } from '@/common/helpers/error-messages.helper';
import { SuccessMessagesHelper } from '@/common/helpers/success-messages.helper';

@Injectable()
export class TemplatesService {
  constructor(private templatesRepository: TemplatesRepository) {}

  async create(dto: CreateTemplateDto, organizationId: string) {
    await this.templatesRepository.create({
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

    return {
      message: SuccessMessagesHelper.TEMPLATE_CREATED,
    };
  }

  async findAll(
    findAllPaginationDto: FindAllPaginationDto,
    organizationId: string,
  ) {
    findAllPaginationDto.organizationId = organizationId;

    return this.templatesRepository.findAll(findAllPaginationDto);
  }

  async findOne(id: string, organizationId: string) {
    const template = await this.templatesRepository.findById(
      id,
      organizationId,
    );

    if (!template)
      throw new NotFoundException(ErrorMessagesHelper.TEMPLATE_NOT_FOUND);

    return template;
  }

  async update(
    id: string,
    updateTemplateDto: UpdateTemplateDto,
    organizationId: string,
  ) {
    await this.findOne(id, organizationId);

    await this.templatesRepository.update(id, organizationId, {
      ...updateTemplateDto,
      tasks: updateTemplateDto.tasks
        ? {
            deleteMany: {},
            create: updateTemplateDto.tasks.map((task, index) => ({
              title: task.title,
              content: task.content,
              order: index,
            })),
          }
        : undefined,
    });

    return {
      message: SuccessMessagesHelper.TEMPLATE_UPDATE,
    };
  }

  async remove(id: string, organizationId: string) {
    await this.findOne(id, organizationId);

    await this.templatesRepository.delete(id);

    return {
      message: SuccessMessagesHelper.TEMPLATE_DELETED,
    };
  }
}
