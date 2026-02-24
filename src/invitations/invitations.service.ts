import { PrismaService } from '@/database/prisma/prisma.service';
import {
  Injectable,
  ConflictException,
  BadRequestException,
  GoneException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { AcceptInvitationDto } from './dto/caccept-invitation.dto';

@Injectable()
export class InvitationsService {
  constructor(private prisma: PrismaService) {}

  async createInvitation(email: string, role: any, orgId: string) {
    // 1. Verificar se o usuário já existe no sistema
    const userExists = await this.prisma.user.findUnique({ where: { email } });
    if (userExists)
      throw new ConflictException('Este usuário já faz parte de uma empresa');

    // 2. Gerar token aleatório
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Expira em 7 dias

    // 3. Salvar o convite
    const invitation = await this.prisma.invitation.create({
      data: {
        email,
        role,
        token,
        expiresAt,
        organizationId: orgId,
      },
    });

    // 4. Aqui você dispararia o e-mail (usando Resend, por exemplo)
    console.log(
      `Enviar e-mail para ${email} com o link: https://onboardix.com/join?token=${token}`,
    );

    return invitation;
  }

  async acceptInvitation(dto: AcceptInvitationDto) {
    // 1. Buscar o convite e validar
    const invitation = await this.prisma.invitation.findUnique({
      where: { token: dto.token },
      include: { organization: true },
    });

    if (!invitation) {
      throw new BadRequestException('Convite inválido ou já utilizado.');
    }

    if (new Date() > invitation.expiresAt) {
      throw new GoneException('Este convite expirou.');
    }

    // 2. Transação para criar o usuário e remover o convite
    return await this.prisma.$transaction(async (tx) => {
      // Aqui você integraria com seu sistema de Auth (Supabase ou Hash de senha manual)
      // Vamos supor que você está criando o usuário no seu banco central:
      const user = await tx.user.create({
        data: {
          email: invitation.email,
          fullName: dto.fullName,
          role: invitation.role,
          organizationId: invitation.organizationId,
          // password: hash(dto.password) -> Se estiver usando auth própria
        },
      });

      // 3. Deletar o convite para não ser reutilizado
      await tx.invitation.delete({
        where: { id: invitation.id },
      });

      return {
        message: 'Conta criada com sucesso!',
        user: {
          id: user.id,
          email: user.email,
          organization: invitation.organization.name,
        },
      };
    });
  }
}
