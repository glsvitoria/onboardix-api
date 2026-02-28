import { UserTask, Task } from '@/generated/prisma/client';

export type UserTaskWithDetails = UserTask & {
  task: Pick<Task, 'title' | 'content' | 'link' | 'order'>;
};

export abstract class UserTasksRepository {
  abstract findByUserId(userId: string): Promise<UserTaskWithDetails[]>;
  abstract findById(
    userTaskId: string,
    userId: string,
  ): Promise<UserTask | null>;
  abstract updateStatus(
    userTaskId: string,
    userId: string,
    completed: boolean,
  ): Promise<UserTask>;
}
