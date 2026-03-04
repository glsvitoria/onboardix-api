import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UserTaskEntity } from './user-task';
import { TaskEntity } from '@/templates/entity/task';
import { PickType } from '@nestjs/mapped-types';

export class UserTaskWithTasksEntity extends PickType(UserTaskEntity, [
  'completedAt',
  'createdAt',
  'id',
  'updatedAt',
]) {
  @ValidateNested()
  @Type(() => TaskEntity)
  tasks: TaskEntity[];

  constructor(partial: Partial<UserTaskWithTasksEntity>) {
    super();
    Object.assign(this, partial);

    if (partial.tasks) {
      this.tasks = (partial.tasks || []).map((task) => new TaskEntity(task));
    }
  }
}
