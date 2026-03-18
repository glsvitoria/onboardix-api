import { ErrorMessageClassValidator } from '@/common/helpers/error-message-class-validator';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDto {
  @IsString({
    message: ErrorMessageClassValidator.string('senha atual', 'f'),
  })
  @IsNotEmpty({
    message: ErrorMessageClassValidator.required('e-mail', 'm'),
  })
  newPassword: string;

  @IsString({
    message: ErrorMessageClassValidator.string('token', 'm'),
  })
  @IsNotEmpty({
    message: ErrorMessageClassValidator.required('token', 'm'),
  })
  token: string;
}
