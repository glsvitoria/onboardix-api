import { PickType } from '@nestjs/mapped-types';
import { UserEntity } from './user';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UserTaskOnlyCompletedAtEntity } from '@/user-tasks/entity/user-task-only-completed-at';

export class UserWithTaskCompletedCountEntity extends PickType(UserEntity, [
  'id',
  'email',
  'fullName',
] as const) {
  @ValidateNested()
  @Type(() => UserTaskOnlyCompletedAtEntity)
  assignedTasks: UserTaskOnlyCompletedAtEntity[];

  constructor(partial: Partial<UserWithTaskCompletedCountEntity>) {
    super();
    Object.assign(this, partial);

    if (partial.assignedTasks) {
      this.assignedTasks = (partial.assignedTasks || []).map(
        (task) => new UserTaskOnlyCompletedAtEntity(task),
      );
    }
  }
}
