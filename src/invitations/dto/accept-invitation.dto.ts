import { PasswordMatch } from '@/common/decorators/password-match.decorator';
import { ErrorMessageClassValidator } from '@/common/helpers/error-message-class-validator';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AcceptInvitationDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString({
    message: ErrorMessageClassValidator.string('nome completo', 'm'),
  })
  @IsNotEmpty({
    message: ErrorMessageClassValidator.required('nome completo', 'm'),
  })
  fullName: string;

  @IsString({
    message: ErrorMessageClassValidator.string('senha', 'f'),
  })
  @IsNotEmpty({
    message: ErrorMessageClassValidator.required('senha', 'f'),
  })
  @MinLength(6, {
    message: ErrorMessageClassValidator.minLength('senha', 6),
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
