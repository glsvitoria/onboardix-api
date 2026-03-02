import { PasswordMatch } from '@/common/decorators/password-match.decorator';
import { ErrorMessageClassValidator } from '@/common/helpers/error-message-class-validator';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsString({
    message: ErrorMessageClassValidator.string('senha atual', 'f'),
  })
  @IsNotEmpty({
    message: ErrorMessageClassValidator.required('senha atual', 'm'),
  })
  currentPassword: string;

  @IsString({
    message: ErrorMessageClassValidator.string('nova senha', 'f'),
  })
  @IsNotEmpty({
    message: ErrorMessageClassValidator.required('nova senha', 'f'),
  })
  @MinLength(6, {
    message: ErrorMessageClassValidator.minLength('nova senha', 6),
  })
  newPassword: string;

  @IsString({
    message: ErrorMessageClassValidator.string('confirmação da nova senha', 'f'),
  })
  @IsNotEmpty({
    message: ErrorMessageClassValidator.required('confirmação da nova senha', 'f'),
  })
  @PasswordMatch('newPassword', {
    message: 'A confirmação de senha deve ser igual a senha',
  })
  confirmPassword: string;
}
