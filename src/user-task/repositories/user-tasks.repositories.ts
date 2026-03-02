import { UserTask, Task } from '@/generated/prisma/client';

export type UserTaskWithDetails = UserTask & {
  task: Pick<Task, 'title' | 'content' | 'link' | 'order'>;
};

export abstract class UserTasksRepository {
  abstract findByUserId(
    userId: string,
    orgId?: string,
  ): Promise<UserTaskWithDetails[]>;
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
