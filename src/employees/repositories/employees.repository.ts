import {
  Prisma,
  Task,
  Template,
  User,
  UserTask,
} from '@/generated/prisma/client';
import { FindAllPaginationDto } from '../dto/find-all-pagination.dto';

export abstract class EmployeesRepository {
  abstract findTemplateWithTasks(
    templateId: string,
    orgId: string,
  ): Promise<(Template & { tasks: { id: string }[] }) | null>;
  abstract assignTasks(
    data: Prisma.UserTaskCreateManyInput[],
  ): Promise<Prisma.BatchPayload>;
  abstract updateTaskStatus(
    userId: string,
    taskId: string,
    completed: boolean,
  ): Promise<UserTask>;
  abstract findUserTask(
    userId: string,
    taskId: string,
  ): Promise<UserTask | null>;
  abstract findAllWithUserTasks(
    findAllPaginationDto: FindAllPaginationDto,
  ): Promise<{
    users: UserWithUserTasks[];
    total: number;
  }>;
  abstract findEmployeeDetail(
    userId: string,
    orgId: string,
  ): Promise<UserWithUserTasks | null>;
}

export enum UserInvitationStatus {
  PENDING,
  ACCEPTED,
}

interface UserWithUserTasks extends User {
  assignedTasks: UserTaskWithTask[];
}

interface UserTaskWithTask extends UserTask {
  task: Task;
}
