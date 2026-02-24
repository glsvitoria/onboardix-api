import { Template, Task, Prisma } from '@/generated/prisma/client';

export type TemplateWithTasks = Template & {
  tasks: Task[];
};

export interface FindAllTemplatesResponse {
  templates: (Template & { _count: { tasks: number } })[];
  total: number;
}

export abstract class TemplatesRepository {
  abstract create(data: Prisma.TemplateCreateInput): Promise<TemplateWithTasks>;

  abstract findAll(organizationId: string): Promise<FindAllTemplatesResponse>;

  abstract findById(
    id: string,
    organizationId: string,
  ): Promise<TemplateWithTasks | null>;

  abstract update(
    id: string,
    organizationId: string,
    data: Prisma.TemplateUpdateInput,
  ): Promise<TemplateWithTasks>;

  abstract delete(id: string): Promise<Template>;
}
