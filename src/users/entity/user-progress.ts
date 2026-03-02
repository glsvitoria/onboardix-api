import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export enum UserOnboardingStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export class UserProgressEntity {
  @IsEnum(UserOnboardingStatus)
  @IsNotEmpty()
  status: UserOnboardingStatus;

  @IsString()
  @IsNotEmpty()
  progress: string;

  @IsNumber()
  @IsNotEmpty()
  taskCount: number;

  constructor(partial: Partial<UserProgressEntity>) {
    Object.assign(this, partial);
  }
}
