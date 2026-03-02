import { PickType } from '@nestjs/mapped-types';
import { UserEntity } from './user';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UserProgressEntity } from './user-progress';

export class UserWithProgressEntity extends PickType(UserEntity, [
  'id',
  'email',
  'fullName',
  'role',
  'createdAt',
  'updatedAt',
] as const) {
  @ValidateNested()
  @Type(() => UserProgressEntity)
  onboarding: UserProgressEntity;

  constructor(partial: Partial<UserWithProgressEntity>) {
    super(partial);

    if (partial.onboarding) {
      this.onboarding = new UserProgressEntity(partial.onboarding);
    }
  }
}
