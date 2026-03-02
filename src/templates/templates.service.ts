import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTemplateDto } from './dto/create-template.dto';
import { TemplatesRepository } from './repositories/template.repository';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { FindAllPaginationDto } from './dto/find-all-pagination.dto';
import { ErrorMessagesHelper } from '@/common/helpers/error-messages.helper';
import { SuccessMessagesHelper } from '@/common/helpers/success-messages.helper';
import { OrganizationsRepository } from '@/organizations/repositories/organizations.repository';
import { TemplateEntity } from './entity/template';

interface UpdateTask {
  id: string;
  title: string;
  content?: string;
  order: number;
}

@Injectable()
export class TemplatesService {
  constructor(
    private templatesRepository: TemplatesRepository,
    private organizationsRepository: OrganizationsRepository,
  ) {}

  async create(userId: string, orgId: string, dto: CreateTemplateDto) {
    const organization = await this.organizationsRepository.findById(
      orgId,
      userId,
    );

    if (!organization)
      throw new NotFoundException(ErrorMessagesHelper.ORGANIZATION_NOT_FOUND);

    await this.templatesRepository.create({
      title: dto.title,
      description: dto.description,
      organization: { connect: { id: orgId } },
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
    organizationId: string,
    findAllPaginationDto: FindAllPaginationDto,
  ) {
    findAllPaginationDto.organizationId = organizationId;

    const { templates, total } =
      await this.templatesRepository.findAll(findAllPaginationDto);

    return {
      templates: templates.map((template) => new TemplateEntity(template)),
      total,
    };
  }

  async findOne(templateId: string, organizationId: string, userId?: string) {
    const template = await this.templatesRepository.findById(
      templateId,
      organizationId,
      userId,
    );

    if (!template)
      throw new NotFoundException(ErrorMessagesHelper.TEMPLATE_NOT_FOUND);

    return template;
  }

  async update(
    userId: string,
    orgId: string,
    templateId: string,
    updateTemplateDto: UpdateTemplateDto,
  ) {
    await this.findOne(templateId, orgId, userId);

    const { tasksToCreate, tasksToUpdate } = updateTemplateDto.tasks.reduce<{
      tasksToCreate: Omit<UpdateTask, 'id'>[];
      tasksToUpdate: UpdateTask[];
    }>(
      (acc, task, index) => {
        if (task.id) {
          acc.tasksToUpdate.push({
            ...task,
            id: task.id,
            order: index,
          });
        } else {
          const { id, ...taskWithoutId } = task;

          acc.tasksToCreate.push({
            ...taskWithoutId,
            order: index,
          });
        }

        return acc;
      },
      { tasksToCreate: [], tasksToUpdate: [] },
    );

    await this.templatesRepository.update(templateId, orgId, {
      ...updateTemplateDto,
      tasks: updateTemplateDto.tasks
        ? {
            update: tasksToUpdate.map((task) => ({
              where: {
                id: task.id,
              },
              data: {
                title: task.title,
                content: task.content,
                order: task.order,
              },
            })),
            create: tasksToCreate.map((task, index) => ({
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

  async remove(userId: string, orgId: string, templateId: string) {
    await this.findOne(templateId, orgId, userId);

    await this.templatesRepository.delete(templateId);

    return {
      message: SuccessMessagesHelper.TEMPLATE_DELETED,
    };
  }
}
