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

@Injectable()
export class InvitationsService {
  private readonly SALT_ROUNDS = 10;

  constructor(
    private readonly invitationsRepository: InvitationsRepository,
    private readonly prisma: PrismaService,
  ) {}

  async createInvitation(email: string, role: any, orgId: string) {
    const userExists = await this.prisma.user.findUnique({ where: { email } });

    if (userExists) throw new ConflictException('Usuário já cadastrado');

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    return this.invitationsRepository.create({
      email,
      role,
      token,
      expiresAt,
      organization: { connect: { id: orgId } },
    });
  }

  async acceptInvitation(dto: AcceptInvitationDto) {
    const invitation = await this.invitationsRepository.findByToken(dto.token);

    if (!invitation) throw new BadRequestException('Convite inválido');
    if (new Date() > invitation.expiresAt) throw new GoneException('Expirado');

    const hashedPassword = await hash(dto.password, this.SALT_ROUNDS);

    return await this.prisma.$transaction(async (tx) => {
      const user = await this.invitationsRepository.createUser(
        {
          email: invitation.email,
          fullName: dto.fullName,
          role: invitation.role,
          organization: { connect: { id: invitation.organizationId } },
          password_hash: hashedPassword,
        },
        tx,
      );

      await this.invitationsRepository.delete(invitation.id, tx);

      return {
        message: 'Conta criada com sucesso!',
        user: { id: user.id, organization: invitation.organization.name },
      };
    });
  }
}
