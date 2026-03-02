import { PrismaService } from '@/database/prisma/prisma.service';
import {
  Injectable,
  ConflictException,
  BadRequestException,
  GoneException,
  NotFoundException,
} from '@nestjs/common';
import { AcceptInvitationDto } from './dto/accept-invitation.dto';
import { InvitationsRepository } from './repositories/invitations.repository';
import { hash } from 'bcryptjs';
import { randomBytes } from 'crypto';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { ErrorMessagesHelper } from '@/common/helpers/error-messages.helper';
import { SuccessMessagesHelper } from '@/common/helpers/success-messages.helper';
import { FindAllPaginationDto } from './dto/find-all-pagination.dto';
import { UsersRepository } from '@/users/repositories/users.repository';
import { MailService } from '@/mail/mail.service';
import { OrganizationsRepository } from '@/organizations/repositories/organizations.repository';
import { SALT_ROUNDS } from '@/auth/strategies/access-token.strategy';
import { InvitationEntity } from './entity/invitation';

@Injectable()
export class InvitationsService {
  constructor(
    private readonly invitationsRepository: InvitationsRepository,
    private readonly organizationsRepository: OrganizationsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly mailService: MailService,
    private readonly prisma: PrismaService,
  ) {}

  async acceptInvitation(acceptInvitationDto: AcceptInvitationDto) {
    const invitation = await this.invitationsRepository.findByToken(
      acceptInvitationDto.token,
    );

    if (!invitation)
      throw new BadRequestException(ErrorMessagesHelper.INVALID_INVITATION);

    if (new Date() > invitation.expiresAt)
      throw new GoneException(ErrorMessagesHelper.EXPIRED_INVITATION);

    const hashedPassword = await hash(
      acceptInvitationDto.password,
      SALT_ROUNDS,
    );

    await this.prisma.$transaction(async (tx) => {
      await this.invitationsRepository.delete(invitation.id, tx);

      return await this.usersRepository.create(
        {
          email: invitation.email,
          fullName: acceptInvitationDto.fullName,
          role: invitation.role,
          organization: { connect: { id: invitation.organizationId } },
          password_hash: hashedPassword,
        },
        tx,
      );
    });

    return {
      message: SuccessMessagesHelper.INVITATION_ACCEPTED,
    };
  }

  async createInvitation(
    userId: string,
    orgId: string,
    createInvitationDto: CreateInvitationDto,
  ) {
    const organization = await this.organizationsRepository.findById(
      orgId,
      userId,
    );

    if (!organization) {
      throw new NotFoundException(ErrorMessagesHelper.ORGANIZATION_NOT_FOUND);
    }

    const user = await this.usersRepository.findByEmail(
      createInvitationDto.email,
    );

    if (user)
      throw new ConflictException(
        ErrorMessagesHelper.USER_WITH_SAME_EMAIL_CREATED,
      );

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.invitationsRepository.create({
      email: createInvitationDto.email,
      role: 'MEMBER',
      token,
      expiresAt,
      organization: { connect: { id: orgId } },
    });

    this.mailService
      .sendInvitationEmployee(
        createInvitationDto.email,
        organization.name,
        token,
      )
      .catch((err) => console.error('Erro silencioso no envio de email:', err));

    return {
      message: SuccessMessagesHelper.INVITATION_CREATED,
    };
  }

  async list(orgId: string, findAllPaginationDto: FindAllPaginationDto) {
    findAllPaginationDto.organizationId = orgId;

    const { invitations, total } =
      await this.invitationsRepository.findAll(findAllPaginationDto);

    return {
      invitations: invitations.map(
        (invitation) => new InvitationEntity(invitation),
      ),
      total,
    };
  }
}
