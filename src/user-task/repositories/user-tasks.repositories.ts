import { UserTask, Task } from '@/generated/prisma/client';

export type UserTaskWithTasks = UserTask & {
  task: Task;
};

export abstract class UserTasksRepository {
  abstract findByUserId(
    userId: string,
    orgId?: string,
  ): Promise<UserTaskWithTasks[]>;
  abstract findById(
    userTaskId: string,
    userId: string,
    organizationId: string,
  ): Promise<UserTask | null>;
  abstract findByTaskId(
    taskId: string,
    userId: string,
    organizationId: string,
  ): Promise<UserTask | null>;
  abstract updateStatus(
    userTaskId: string,
    userId: string,
    completed: boolean,
  ): Promise<UserTask>;
}
