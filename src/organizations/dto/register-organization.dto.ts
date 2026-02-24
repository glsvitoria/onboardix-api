import { PasswordMatch } from '@/common/decorators/password-match.decorator';
import { IsEmail, IsNotEmpty, IsString, Min, MinLength } from 'class-validator';

export class RegisterOrganizationDto {
  @IsString({
    message: 'O nome da empresa deve ser uma string',
  })
  @IsNotEmpty({
    message: 'O nome da empresa não pode ser vazio',
  })
  companyName: string;

  @IsString({
    message: 'O nome do dono da empresa deve ser uma string',
  })
  @IsNotEmpty({
    message: 'O nome do dono da empresa não pode ser vazio',
  })
  ownerName: string;

  @IsEmail(
    {},
    {
      message: 'O e-mail deve ser válido',
    },
  )
  @IsNotEmpty({
    message: 'O email não pode ser vazio',
  })
  email: string;

  @IsString({
    message: 'A senha deve ser uma string',
  })
  @IsNotEmpty({
    message: 'A senha não pode ser vazia',
  })
  @MinLength(6, {
    message: 'A senha deve ter no mínimo 6 dígitos.',
  })
  password: string;

  @IsString({
    message: 'A confirmação de senha deve ser uma string',
  })
  @IsNotEmpty({
    message: 'A confirmação de senha não pode ser vazia',
  })
  @PasswordMatch({
    message: 'A confirmação de senha deve ser igual a senha',
  })
  confirmPassword: string;
}
