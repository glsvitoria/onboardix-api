import { UserTask, Task } from '@/generated/prisma/client';

export type UserTaskWithDetails = UserTask & {
  task: Pick<Task, 'title' | 'content' | 'link' | 'order'>;
};

export abstract class UserTasksRepository {
  abstract findByUserId(userId: string): Promise<UserTaskWithDetails[]>;
  abstract findByIds(userId: string, taskId: string): Promise<UserTask | null>;
  abstract updateStatus(
    userId: string,
    taskId: string,
    completed: boolean,
  ): Promise<UserTask>;
}
