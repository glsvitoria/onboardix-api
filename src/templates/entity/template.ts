import { IsNullable } from '@/common/decorators/is-nullable';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsString, IsUUID, IsDate } from 'class-validator';

export class TemplateEntity {
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
  @IsDate()
  @IsNotEmpty()
  deletedAt: Date | null;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNullable()
  @IsString()
  @IsNotEmpty()
  description: string | null;

  @Exclude()
  @IsUUID()
  organizationId: string;

  constructor(partial: Partial<TemplateEntity>) {
    Object.assign(this, partial);
  }
}
