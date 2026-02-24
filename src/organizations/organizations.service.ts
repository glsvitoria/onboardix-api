import { Injectable, ConflictException } from '@nestjs/common';
import { RegisterOrganizationDto } from './dto/register-organization.dto';
import {
  PrismaService,
  PrismaTransactionClient,
} from '@/database/prisma/prisma.service';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  async register(dto: RegisterOrganizationDto) {
    const slug = this.generateSlug(dto.companyName);

    // Verificar se o e-mail ou slug já existem
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) throw new ConflictException('E-mail já cadastrado');

    return this.prisma.$transaction(async (tx) => {
      const organization = await tx.organization.create({
        data: {
          name: dto.companyName,
          slug: slug,
        },
      });

      const user = await tx.user.create({
        data: {
          email: dto.email,
          fullName: dto.ownerName,
          role: 'OWNER', // Primeiro usuário é sempre o dono
          organizationId: organization.id,
        },
      });

      return { organization, user };
    });
  }
}
