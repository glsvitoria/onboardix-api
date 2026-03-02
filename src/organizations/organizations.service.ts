import { Injectable, ConflictException } from '@nestjs/common';
import { RegisterOrganizationDto } from './dto/register-organization.dto';
import { PrismaService } from '@/database/prisma/prisma.service';
import { OrganizationsRepository } from './repositories/organizations.repository';
import { hash } from 'bcryptjs';
import { UsersRepository } from '@/users/repositories/users.repository';
import { UserRole } from '@/generated/prisma/enums';
import { ErrorMessagesHelper } from '@/common/helpers/error-messages.helper';
import { SuccessMessagesHelper } from '@/common/helpers/success-messages.helper';
import { MailService } from '@/mail/mail.service';
import { SALT_ROUNDS } from '@/auth/strategies/access-token.strategy';

@Injectable()
export class OrganizationsService {
  constructor(
    private readonly organizationsRepository: OrganizationsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async register(dto: RegisterOrganizationDto) {
    const slug = this.generateSlug(dto.companyName);

    const user = await this.usersRepository.findByEmail(dto.email);

    if (user)
      throw new ConflictException(
        ErrorMessagesHelper.USER_WITH_SAME_EMAIL_CREATED,
      );

    const organizationSlug =
      await this.organizationsRepository.findBySlug(slug);

    if (organizationSlug)
      throw new ConflictException(
        ErrorMessagesHelper.ORGANIZATION_WITH_SAME_SLUG_CREATED,
      );

    const hashedPassword = await hash(dto.password, SALT_ROUNDS);

    await this.prisma.$transaction(async (tx) => {
      const organization = await this.organizationsRepository.create(
        {
          name: dto.companyName,
          slug: slug,
        },
        tx,
      );

      await this.usersRepository.create(
        {
          email: dto.email,
          fullName: dto.ownerName,
          password_hash: hashedPassword,
          role: UserRole.OWNER,
          organization: { connect: { id: organization.id } },
        },
        tx,
      );
    });

    this.mailService
      .sendWelcomeOrganization(dto.email, dto.ownerName, dto.companyName)
      .catch((err) =>
        console.error(
          '[MailService] Erro silencioso no envio de boas-vindas:',
          err,
        ),
      );

    return {
      message: SuccessMessagesHelper.ORGANIZATION_CREATED,
    };
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
}
