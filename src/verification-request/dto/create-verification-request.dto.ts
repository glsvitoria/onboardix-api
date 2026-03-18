import { ErrorMessageClassValidator } from '@/common/helpers/error-message-class-validator';
import { VerificationType } from '@/generated/prisma/enums';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
} from 'class-validator';

export class CreateVerificationRequestDto {
  @IsEmail(
    {},
    {
      message: 'O e-mail informado é inválido',
    },
  )
  @IsNotEmpty({
    message: ErrorMessageClassValidator.required('e-mail', 'm'),
  })
  identifier: string;

  @IsEnum(VerificationType, {
    message: `O tipo de verificação deve ser um dos seguintes valores: ${Object.values(VerificationType).join(', ')}`,
  })
  @IsNotEmpty({
    message: ErrorMessageClassValidator.required('tipo de verificação', 'm'),
  })
  type: VerificationType;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
