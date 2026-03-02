import { IsNullable } from '@/common/decorators/is-nullable';
import { Exclude } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsDate,
  IsNumber,
} from 'class-validator';

export class TaskEntity {
  @IsUUID()
  @IsNotEmpty()
  id: string;

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

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  order: number;

  @IsNullable()
  @IsString()
  @IsNumber()
  content: string | null;

  @IsNullable()
  @IsString()
  @IsNumber()
  link: string;

  @Exclude()
  @IsUUID()
  templateId: string;

  constructor(partial: Partial<TaskEntity>) {
    Object.assign(this, partial);
  }
}
