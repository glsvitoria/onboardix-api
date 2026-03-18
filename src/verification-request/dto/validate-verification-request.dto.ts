import { ErrorMessageClassValidator } from '@/common/helpers/error-message-class-validator';
import { VerificationType } from '@/generated/prisma/enums';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class ValidateVerificationRequestDto {
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

  @IsString()
  @IsNotEmpty({
    message: ErrorMessageClassValidator.required('código', 'm'),
  })
  code: string;
}
