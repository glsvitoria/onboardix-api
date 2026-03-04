import { IsNullable } from '@/common/decorators/is-nullable';
import { IsDate, IsNotEmpty } from 'class-validator';

export class UserTaskOnlyCompletedAtEntity {
  @IsNullable()
  @IsDate()
  @IsNotEmpty()
  completedAt: Date | null;

  constructor(partial: Partial<UserTaskOnlyCompletedAtEntity>) {
    Object.assign(this, partial);
  }
}
