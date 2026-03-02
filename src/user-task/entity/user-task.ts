import { IsNullable } from '@/common/decorators/is-nullable';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsUUID, IsDate } from 'class-validator';

export class UserTaskEntity {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @Exclude()
  @IsUUID()
  userId: string;

  @Exclude()
  @IsUUID()
  taskId: string;

  @IsNullable()
  @IsDate()
  completedAt: Date | null;

  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @IsNullable()
  @IsDate()
  @IsNotEmpty()
  updatedAt: Date | null;

  @Exclude()
  @IsNullable()
  @IsDate()
  @IsNotEmpty()
  deletedAt: Date | null;

  constructor(partial: Partial<UserTaskEntity>) {
    Object.assign(this, partial);
  }
}
