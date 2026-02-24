import { PrismaService } from '@/database/prisma/prisma.service';
import {
  Injectable,
  ConflictException,
  BadRequestException,
  GoneException,
} from '@nestjs/common';
import { AcceptInvitationDto } from './dto/accept-invitation.dto';
import { InvitationsRepository } from './repositories/invitations.repository';
import { hash } from 'bcryptjs';
import { randomBytes } from 'crypto';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { ErrorMessagesHelper } from '@/common/helpers/error-messages.helper';
import { SuccessMessagesHelper } from '@/common/helpers/success-messages.helper';

@Injectable()
export class InvitationsService {
  private readonly SALT_ROUNDS = 10;

  constructor(
    private readonly invitationsRepository: InvitationsRepository,
    private readonly prisma: PrismaService,
  ) {}

  async createInvitation(
    createInvitationDto: CreateInvitationDto,
    orgId: string,
  ) {
    const userExists = await this.prisma.user.findUnique({
      where: { email: createInvitationDto.email },
    });

    if (userExists)
      throw new ConflictException(
        ErrorMessagesHelper.USER_WITH_SAME_EMAIL_CREATED,
      );

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.invitationsRepository.create({
      email: createInvitationDto.email,
      role: createInvitationDto.role,
      token,
      expiresAt,
      organization: { connect: { id: orgId } },
    });

    return {
      message: SuccessMessagesHelper.INVITATION_CREATED,
    };
  }

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
      this.SALT_ROUNDS,
    );

    await this.prisma.$transaction(async (tx) => {
      await this.invitationsRepository.delete(invitation.id, tx);

      return await this.invitationsRepository.createUser(
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
}
