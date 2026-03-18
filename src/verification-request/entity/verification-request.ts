import { IsNullable } from '@/common/decorators/is-nullable';
import { VerificationType } from '@/generated/prisma/enums';
import { JsonValue } from '@prisma/client/runtime/client';
import { Exclude } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsJSON,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class VerificationRequestEntity {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  identifier: string;

  @Exclude()
  hashed_code: string;

  @IsDate()
  @IsNotEmpty()
  expiresAt: Date;

  @IsEnum(VerificationType)
  @IsNotEmpty()
  type: VerificationType;

  @IsNullable()
  @IsJSON()
  @IsNotEmpty()
  metadata: JsonValue | null;

  @IsNumber()
  @IsNotEmpty()
  attempts: number;

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

  constructor(partial: Partial<VerificationRequestEntity>) {
    Object.assign(this, partial);
  }
}
