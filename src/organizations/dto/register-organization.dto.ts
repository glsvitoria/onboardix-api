import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

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
}
