import { IsNullable } from '@/common/decorators/is-nullable';
import { UserRole } from '@/generated/prisma/enums';
import { Exclude } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsDate,
  IsEmail,
  IsEnum,
} from 'class-validator';

export class InvitationEntity {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @Exclude()
  @IsUUID()
  organizationId: string;

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

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;

  @IsString()
  @IsNotEmpty()
  token: string;

  @IsDate()
  @IsNotEmpty()
  expiresAt: Date;

  constructor(partial: Partial<InvitationEntity>) {
    Object.assign(this, partial);
  }
}
