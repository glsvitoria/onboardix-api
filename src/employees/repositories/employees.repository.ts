import { Prisma, Task, User, UserTask } from '@/generated/prisma/client';
import { FindAllPaginationDto } from '../dto/find-all-pagination.dto';

export abstract class EmployeesRepository {
  abstract assignTasks(
    data: Prisma.UserTaskCreateManyInput[],
  ): Promise<Prisma.BatchPayload>;
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
  abstract updateTaskStatus(
    userId: string,
    taskId: string,
    completed: boolean,
  ): Promise<void>;
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
