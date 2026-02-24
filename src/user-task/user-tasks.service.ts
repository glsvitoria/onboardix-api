import { Injectable, NotFoundException } from '@nestjs/common';
import { UserTasksRepository } from './repositories/user-tasks.repositories';

@Injectable()
export class UserTasksService {
  constructor(private readonly userTasksRepository: UserTasksRepository) {}

  async getMyTasks(userId: string) {
    return this.userTasksRepository.findByUserId(userId);
  }

  async toggleTask(userId: string, taskId: string, completed: boolean) {
    const task = await this.userTasksRepository.findByIds(userId, taskId);
    if (!task)
      throw new NotFoundException('Tarefa não encontrada para este usuário');

    return this.userTasksRepository.updateStatus(userId, taskId, completed);
  }
}
