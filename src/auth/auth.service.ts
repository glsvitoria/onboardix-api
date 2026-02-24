import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { compare } from 'bcryptjs';
import { UsersRepository } from '@/users/repositories/users.repository';
import { ErrorMessagesHelper } from '@/common/helpers/error-messages.helper';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const userExists = await this.usersRepository.findByEmail(loginDto.email);

    if (!userExists) {
      throw new UnauthorizedException(ErrorMessagesHelper.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await compare(
      loginDto.password,
      userExists.password_hash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(ErrorMessagesHelper.INVALID_CREDENTIALS);
    }

    const payload = {
      sub: userExists.id,
      email: userExists.email,
      role: userExists.role,
      orgId: userExists.organizationId,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
