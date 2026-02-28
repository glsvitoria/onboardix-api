// users.service.ts
import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { compare, hash } from 'bcryptjs';
import { UsersRepository } from './repositories/users.repository';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.usersRepository.findById(userId);

    if (!user) throw new NotFoundException('Usuário não encontrado');

    return this.usersRepository.update(userId, {
      fullName: dto.fullName,
      email: dto.email,
    });
  }

  async updatePassword(userId: string, dto: UpdatePasswordDto) {
    const user = await this.usersRepository.findById(userId);

    if (!user) throw new NotFoundException('Usuário não encontrado');

    const isPasswordValid = await compare(
      dto.currentPassword,
      user.password_hash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('A senha atual está incorreta');
    }

    const hashedPassword = await hash(dto.newPassword, 10);

    await this.usersRepository.update(userId, {
      password_hash: hashedPassword,
    });

    return { message: 'Senha atualizada com sucesso' };
  }
}
