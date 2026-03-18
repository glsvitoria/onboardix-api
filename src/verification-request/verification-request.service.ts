import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { compare, hash } from 'bcryptjs';
import { VerificationRequestsRepository } from './repositories/verification-request.repository';
import { CreateVerificationRequestDto } from './dto/create-verification-request.dto';
import { randomInt } from 'crypto';
import { MailService } from '@/mail/mail.service';
import { SuccessMessagesHelper } from '@/common/helpers/success-messages.helper';
import { VerificationType } from '@/generated/prisma/enums';
import { ErrorMessagesHelper } from '@/common/helpers/error-messages.helper';
import { JwtService } from '@nestjs/jwt';
import { env } from '@/config/env-validation';
import { UsersRepository } from '@/users/repositories/users.repository';

@Injectable()
export class VerificationRequestService {
  constructor(
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    private readonly usersRepository: UsersRepository,
    private readonly verificationRequestsRepository: VerificationRequestsRepository,
  ) {}

  async create(data: CreateVerificationRequestDto) {
    const { identifier, type } = data;

    const code = this.generateCode();

    const expiresAt = new Date(Date.now() + 1000 * 60 * 15);

    const hashedCode = await hash(code, 10);

    let verificationRequest =
      await this.verificationRequestsRepository.findByIdentifier(
        identifier,
        type,
      );

    if (verificationRequest) {
      verificationRequest = await this.verificationRequestsRepository.update(
        verificationRequest.id,
        {
          hashedCode,
          expiresAt,
        },
      );
    } else {
      verificationRequest = await this.verificationRequestsRepository.create({
        identifier,
        type,
        hashedCode,
        expiresAt,
      });
    }

    await this.mailService.sendPasswordRecovery(identifier, code);

    return {
      message: SuccessMessagesHelper.RECOVERY_EMAIL_SENT,
    };
  }

  async resetPassword(token: string, newPassword: string) {
    let payload: { email: string; type: VerificationType; expiresIn: Date };

    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: env.ACCESS_TOKEN_SECRET,
      });
    } catch {
      throw new UnauthorizedException(ErrorMessagesHelper.INVALID_CREDENTIALS);
    }

    const { email, type } = payload;

    const verificationRequest =
      await this.verificationRequestsRepository.findByIdentifier(email, type);

    if (!verificationRequest || !verificationRequest.validatedAt) {
      throw new UnauthorizedException(
        ErrorMessagesHelper.VERIFICATION_REQUEST_NOT_FOUND,
      );
    }

    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundException(ErrorMessagesHelper.USER_NOT_FOUND);
    }

    const hashedPassword = await hash(newPassword, 10);

    await this.usersRepository.update(user.id, {
      password_hash: hashedPassword,
    });

    await this.verificationRequestsRepository.delete(verificationRequest.id);

    return {
      message: SuccessMessagesHelper.PASSWORD_RESET_SUCCESSFULLY,
    };
  }

  async validate(identifier: string, type: VerificationType, code: string) {
    const verificationRequest =
      await this.verificationRequestsRepository.findByIdentifier(
        identifier,
        type,
      );

    if (!verificationRequest) {
      throw new NotFoundException(
        ErrorMessagesHelper.VERIFICATION_REQUEST_NOT_FOUND,
      );
    }

    if (verificationRequest.attempts >= 5) {
      await this.verificationRequestsRepository.delete(verificationRequest.id);
      throw new UnauthorizedException(
        ErrorMessagesHelper.VERIFICATION_REQUEST_ATTEMPTS_EXCEEDED,
      );
    }
    const isExpired = new Date() > verificationRequest.expiresAt;
    if (isExpired) {
      throw new BadRequestException(
        ErrorMessagesHelper.VERIFICATION_REQUEST_EXPIRED,
      );
    }

    const isCodeValid = await compare(code, verificationRequest.hashedCode);

    if (!isCodeValid) {
      await this.verificationRequestsRepository.update(verificationRequest.id, {
        attempts: verificationRequest.attempts + 1,
      });
      throw new BadRequestException(
        ErrorMessagesHelper.VERIFICATION_REQUEST_CODE_INVALID,
      );
    }

    await this.verificationRequestsRepository.update(verificationRequest.id, {
      validatedAt: new Date(),
    });

    const tokenPayload = {
      sub: '',
      email: identifier,
      type: type,
      expiresIn: new Date(new Date().getTime() + 5 * 60 * 1000), // 5 minutes
    };

    return {
      message:
        SuccessMessagesHelper.VERIFICATION_REQUEST_CODE_VALIDATED_SUCCESSFULLY,
      token: await this.jwtService.signAsync(tokenPayload, {
        expiresIn: '5m',
        secret: env.ACCESS_TOKEN_SECRET,
      }),
    };
  }

  private generateCode(): string {
    return randomInt(100000, 999999).toString();
  }
}
