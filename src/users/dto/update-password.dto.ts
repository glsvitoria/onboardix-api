import { PasswordMatch } from '@/common/decorators/password-match.decorator';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsString({
    message: 'A senha deve ser uma string',
  })
  @IsNotEmpty({
    message: 'A senha não pode ser vazia',
  })
  currentPassword: string;

  @IsString({
    message: 'A senha deve ser uma string',
  })
  @IsNotEmpty({
    message: 'A senha não pode ser vazia',
  })
  @MinLength(6, {
    message: 'A senha deve ter no mínimo 6 dígitos',
  })
  newPassword: string;

  @IsString({
    message: 'A confirmação de senha deve ser uma string',
  })
  @IsNotEmpty({
    message: 'A confirmação de senha não pode ser vazia',
  })
  @PasswordMatch('newPassword', {
    message: 'A confirmação de senha deve ser igual a senha',
  })
  confirmPassword: string;
}
