import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { compare, hash } from 'bcryptjs';
import { UsersRepository } from '@/users/repositories/users.repository';
import { ErrorMessagesHelper } from '@/common/helpers/error-messages.helper';
import { OrganizationsRepository } from '@/organizations/repositories/organizations.repository';
import { UserWithOrganizationEntity } from '@/users/entity/user-with-organization';
import { env } from '@/config/env-validation';
import { RefreshTokensRepository } from '@/refresh-token/repositories/refresh-token';
import { SALT_ROUNDS } from './strategies/refresh-token.strategy';
import { User } from '@/generated/prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly organizationsRepository: OrganizationsRepository,
    private readonly refreshTokensRepository: RefreshTokensRepository,
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersRepository.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException(ErrorMessagesHelper.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await compare(
      loginDto.password,
      user.password_hash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(ErrorMessagesHelper.INVALID_CREDENTIALS);
    }

    return await this.generateToken(user);
  }

  async profile(userId: string, orgId: string) {
    const user = await this.usersRepository.findById(userId, orgId);

    if (!user) {
      throw new NotFoundException(ErrorMessagesHelper.USER_NOT_FOUND);
    }

    const organization = await this.organizationsRepository.findById(
      user.organizationId,
    );

    if (!organization) {
      throw new NotFoundException(ErrorMessagesHelper.ORGANIZATION_NOT_FOUND);
    }

    return new UserWithOrganizationEntity({
      ...user,
      organization,
    });
  }

  async refresh(userId: string, refreshToken: string) {
    const user = await this.usersRepository.findById(userId);

    if (!user) throw new NotFoundException(ErrorMessagesHelper.USER_NOT_FOUND);

    const refreshTokenSaved =
      await this.refreshTokensRepository.findByUserId(userId);

    if (!refreshTokenSaved)
      throw new NotFoundException(ErrorMessagesHelper.REFRESH_TOKEN_NOT_FOUND);

    const isValid = await compare(refreshTokenSaved.hashedToken, refreshToken);

    if (!isValid)
      throw new UnauthorizedException(
        ErrorMessagesHelper.REFRESH_TOKEN_INVALID,
      );

    if (refreshTokenSaved.expiresAt < new Date()) {
      await this.refreshTokensRepository.delete(refreshTokenSaved.id);
      throw new UnauthorizedException(
        ErrorMessagesHelper.REFRESH_TOKEN_EXPIRED,
      );
    }

    await this.refreshTokensRepository.delete(refreshTokenSaved.id);

    return await this.generateToken(user);
  }

  private async generateToken(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      orgId: user.organizationId,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: env.ACCESS_TOKEN_SECRET,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: env.REFRESH_TOKEN_SECRET,
        expiresIn: '7d',
      }),
    ]);

    const now = new Date();
    const accessTokenExpiresAt = new Date(now.getTime() + 15 * 60000); // +15 min
    const refreshTokenExpiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60000); // +7 dias

    await this.refreshTokensRepository.create({
      expiresAt: refreshTokenExpiresAt,
      hashedToken: await hash(refreshToken, SALT_ROUNDS),
      user: {
        connect: {
          id: user.id,
        },
      },
    });

    return {
      accessToken,
      accessTokenExpiresAt,
      refreshToken,
      refreshTokenExpiresAt,
    };
  }
}
