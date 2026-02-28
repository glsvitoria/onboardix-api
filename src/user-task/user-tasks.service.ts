import { Injectable, NotFoundException } from '@nestjs/common';
import { UserTasksRepository } from './repositories/user-tasks.repositories';
import { ErrorMessagesHelper } from '@/common/helpers/error-messages.helper';

@Injectable()
export class UserTasksService {
  constructor(private readonly userTasksRepository: UserTasksRepository) {}

  async getMyTasks(userId: string) {
    return this.userTasksRepository.findByUserId(userId);
  }

  async toggleTask(userId: string, userTaskId: string, completed: boolean) {
    const task = await this.userTasksRepository.findById(userTaskId, userId);

    if (!task)
      throw new NotFoundException(ErrorMessagesHelper.TASK_NOT_FOUND_TO_USER);

    return this.userTasksRepository.updateStatus(userTaskId, userId, completed);
  }
}
