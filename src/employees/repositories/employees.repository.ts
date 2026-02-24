import { Prisma, Template, User, UserTask } from '@/generated/prisma/client';

export abstract class EmployeesRepository {
  abstract findTemplateWithTasks(
    templateId: string,
    orgId: string,
  ): Promise<(Template & { tasks: { id: string }[] }) | null>;
  abstract assignTasks(
    data: Prisma.UserTaskCreateManyInput[],
  ): Promise<Prisma.BatchPayload>;
  abstract findUserTasks(userId: string): Promise<any[]>;
  abstract updateTaskStatus(
    userId: string,
    taskId: string,
    completed: boolean,
  ): Promise<UserTask>;
  abstract findUserTask(
    userId: string,
    taskId: string,
  ): Promise<UserTask | null>;
  abstract findAllByOrg(orgId: string): Promise<any[]>;
  abstract findEmployeeDetail(
    userId: string,
    orgId: string,
  ): Promise<any | null>;
  abstract findUserById(userId: string): Promise<User | null>;
}
