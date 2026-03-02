import { PasswordMatch } from '@/common/decorators/password-match.decorator';
import { ErrorMessageClassValidator } from '@/common/helpers/error-message-class-validator';
import { IsEmail, IsNotEmpty, IsString, Min, MinLength } from 'class-validator';

export class RegisterOrganizationDto {
  @IsString({
    message: ErrorMessageClassValidator.string('nome da empresa', 'm'),
  })
  @IsNotEmpty({
    message: ErrorMessageClassValidator.required('nome da empresa', 'm'),
  })
  companyName: string;

  @IsString({
    message: ErrorMessageClassValidator.string('nome do dono da empresa', 'm'),
  })
  @IsNotEmpty({
    message: ErrorMessageClassValidator.required('nome do dono da empresa', 'm'),
  })
  ownerName: string;

  @IsEmail(
    {},
    {
      message: 'O e-mail deve ser válido',
    },
  )
  @IsNotEmpty({
    message: ErrorMessageClassValidator.required('e-mail', 'm'),
  })
  email: string;

  @IsString({
    message: ErrorMessageClassValidator.string('senha', 'f'),
  })
  @IsNotEmpty({
    message: ErrorMessageClassValidator.required('senha', 'f'),
  })
  @MinLength(6, {
    message: ErrorMessageClassValidator.minValue('senha', 6),
  })
  password: string;

  @IsString({
    message: ErrorMessageClassValidator.string('confirmação de senha', 'f'),
  })
  @IsNotEmpty({
    message: ErrorMessageClassValidator.required('confirmação de senha', 'f'),
  })
  @PasswordMatch('password', {
    message: 'A confirmação de senha deve ser igual a senha',
  })
  confirmPassword: string;
}
