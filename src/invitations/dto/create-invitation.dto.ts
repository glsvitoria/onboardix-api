import { UserRole } from '@/generated/prisma/enums';
import { IsEmail, IsIn, IsNotEmpty } from 'class-validator';

export class CreateInvitationDto {
  @IsEmail(
    {},
    {
      message: 'O e-mail deve ser válido',
    },
  )
  @IsNotEmpty({
    message: 'O e-mail não pode ser vazio',
  })
  email: string;

  @IsIn([UserRole.ADMIN, UserRole.MEMBER], {
    message: 'O cargo deve ser ADMIN ou MEMBER',
  })
  @IsNotEmpty({
    message: 'O cargo não pode ser vazio',
  })
  role: UserRole;
}
