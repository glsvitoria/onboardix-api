import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail(
    {},
    {
      message: 'O e-mail informado é inválido',
    },
  )
  @IsNotEmpty({
    message: 'O e-mail é obrigatório e não poder ser vazio',
  })
  email: string;

  @IsString({
    message: 'A senha deve ser uma string',
  })
  @IsNotEmpty({
    message: 'A senha é obrigatório e não poder ser vazia',
  })
  password: string;
}
