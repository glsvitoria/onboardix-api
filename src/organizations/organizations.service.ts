import { Injectable, ConflictException } from '@nestjs/common';
import { RegisterOrganizationDto } from './dto/register-organization.dto';
import { PrismaService } from '@/database/prisma/prisma.service';
import { OrganizationsRepository } from './repositories/organizations.repository';
import { hash } from 'bcryptjs';
import { UsersRepository } from '@/users/repositories/users.repository';
import { UserRole } from '@/generated/prisma/enums';
import { ErrorMessagesHelper } from '@/common/helpers/error-messages.helper';
import { SuccessMessagesHelper } from '@/common/helpers/success-messages.helper';

@Injectable()
export class OrganizationsService {
  private readonly SALT_ROUNDS = 10;

  constructor(
    private readonly organizationsRepository: OrganizationsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly prisma: PrismaService,
  ) {}

  async register(dto: RegisterOrganizationDto) {
    const slug = this.generateSlug(dto.companyName);

    const userExists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (userExists)
      throw new ConflictException(
        ErrorMessagesHelper.USER_WITH_SAME_EMAIL_CREATED,
      );

    const organizationSlugExists =
      await this.organizationsRepository.findBySlug(slug);

    if (organizationSlugExists)
      throw new ConflictException(
        ErrorMessagesHelper.ORGANIZATION_WITH_SAME_SLUG_CREATED,
      );

    const hashedPassword = await hash(dto.password, this.SALT_ROUNDS);

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
