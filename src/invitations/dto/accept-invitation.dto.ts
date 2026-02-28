import { PasswordMatch } from '@/common/decorators/password-match.decorator';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AcceptInvitationDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString({
    message: 'O nome deve ser uma string',
  })
  @IsNotEmpty({
    message: 'O nome não pode ser vazio',
  })
  fullName: string;

  @IsString({
    message: 'A senha deve ser uma string',
  })
  @IsNotEmpty({
    message: 'A senha não pode ser vazia',
  })
  @MinLength(6, {
    message: 'A senha deve ter no mínimo 6 dígitos',
  })
  password: string;

  @IsString({
    message: 'A confirmação de senha deve ser uma string',
  })
  @IsNotEmpty({
    message: 'A confirmação de senha não pode ser vazia',
  })
  @PasswordMatch('password', {
    message: 'A confirmação de senha deve ser igual a senha',
  })
  confirmPassword: string;
}
