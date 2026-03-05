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
import { ErrorMessagesHelper } from '@/common/helpers/error-messages.helper';
import { SALT_ROUNDS } from '@/auth/strategies/access-token.strategy';
import { SuccessMessagesHelper } from '@/common/helpers/success-messages.helper';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findOne(userId: string, orgId: string) {
    const user = await this.usersRepository.findById(userId, orgId);

    if (!user) throw new NotFoundException(ErrorMessagesHelper.USER_NOT_FOUND);

    return user;
  }

  async updateProfile(userId: string, orgId: string, dto: UpdateProfileDto) {
    await this.findOne(userId, orgId);

    await this.usersRepository.update(userId, {
      fullName: dto.fullName,
      email: dto.email,
    });

    return {
      message: SuccessMessagesHelper.USER_PROFILE_UPDATED,
    };
  }

  async updatePassword(userId: string, orgId: string, dto: UpdatePasswordDto) {
    const user = await this.findOne(userId, orgId);

    const isPasswordValid = await compare(
      dto.currentPassword,
      user.password_hash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        ErrorMessagesHelper.USER_PASSWORD_INCORRECT,
      );
    }

    const hashedPassword = await hash(dto.newPassword, SALT_ROUNDS);

    await this.usersRepository.update(userId, {
      password_hash: hashedPassword,
    });

    return { message: SuccessMessagesHelper.USER_PASSWORD_UPDATED };
  }
}
