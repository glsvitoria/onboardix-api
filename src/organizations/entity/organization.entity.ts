import { IsNullable } from '@/common/decorators/is-nullable';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsString, IsUUID, IsDate } from 'class-validator';

export class OrganizationEntity {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

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

  constructor(partial: Partial<OrganizationEntity>) {
    Object.assign(this, partial);
  }
}
