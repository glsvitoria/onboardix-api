import { Template, Task, Prisma } from '@/generated/prisma/client';
import { FindAllPaginationDto } from '../dto/find-all-pagination.dto';

export interface TemplateWithTasks extends Template {
  tasks: Task[];
}

export interface TemplateWithTasksCount extends Template {
  _count: {
    tasks: number;
  };
}

export abstract class TemplatesRepository {
  abstract create(data: Prisma.TemplateCreateInput): Promise<TemplateWithTasks>;

  abstract delete(id: string): Promise<Template>;

  abstract findAll(findAllPaginationDto: FindAllPaginationDto): Promise<{
    templates: TemplateWithTasksCount[];
    total: number;
  }>;

  abstract findById(
    id: string,
    organizationId: string,
  ): Promise<TemplateWithTasks | null>;

  abstract update(
    id: string,
    organizationId: string,
    data: Prisma.TemplateUpdateInput,
  ): Promise<TemplateWithTasks>;

  abstract searchByName(
    name: string,
    orgId: string,
  ): Promise<Pick<Template, 'id' | 'title'>[]>;
}
