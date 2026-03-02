import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsString({
    message: 'O nome deve ser uma string',
  })
  @IsOptional()
  fullName?: string;

  @IsEmail({}, {
    message: "O e-mail deve ser válido"
  })
  @IsOptional()
  email?: string;
}
