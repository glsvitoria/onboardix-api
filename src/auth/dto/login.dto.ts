import { ErrorMessageClassValidator } from '@/common/helpers/error-message-class-validator';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail(
    {},
    {
      message: 'O e-mail informado é inválido',
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
  password: string;
}
