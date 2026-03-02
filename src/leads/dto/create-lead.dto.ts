import { ErrorMessageClassValidator } from '@/common/helpers/error-message-class-validator';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLeadDto {
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
}
