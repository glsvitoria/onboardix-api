import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { compare } from 'bcryptjs';
import { UsersRepository } from '@/users/repositories/users.repository';
import { ErrorMessagesHelper } from '@/common/helpers/error-messages.helper';
import { OrganizationsRepository } from '@/organizations/repositories/organizations.repository';
import { UserWithOrganizationEntity } from '@/users/entity/user-with-organization';

@Injectable()
export class AuthService {
  constructor(
    private readonly organizationsRepository: OrganizationsRepository,
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

    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
    };
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
}
