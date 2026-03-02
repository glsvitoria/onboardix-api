import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UserTaskEntity } from './user-task';
import { TaskEntity } from '@/templates/entity/task';

export class UserTaskWithTasksEntity extends UserTaskEntity {
  @ValidateNested()
  @Type(() => TaskEntity)
  tasks: TaskEntity[];

  constructor(partial: Partial<UserTaskWithTasksEntity>) {
    super(partial);

    if (partial.tasks) {
      this.tasks = (partial.tasks || []).map((task) => new TaskEntity(task));
    }
  }
}
