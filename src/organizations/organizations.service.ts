import { Injectable, ConflictException } from '@nestjs/common';
import { RegisterOrganizationDto } from './dto/register-organization.dto';
import { PrismaService } from '@/database/prisma/prisma.service';
import { OrganizationsRepository } from './repositories/organizations.repository';
import { hash } from 'bcryptjs';

@Injectable()
export class OrganizationsService {
  private readonly SALT_ROUNDS = 10;

  constructor(
    private readonly organizationsRepository: OrganizationsRepository,
    private readonly prisma: PrismaService,
  ) {}

  async register(dto: RegisterOrganizationDto) {
    const slug = this.generateSlug(dto.companyName);

    // 1. Validações rápidas
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser) throw new ConflictException('E-mail já cadastrado');

    const existingSlug = await this.organizationsRepository.findBySlug(slug);
    if (existingSlug) throw new ConflictException('Empresa já registrada');

    // 2. Hash da senha antes da transação
    const hashedPassword = await hash(dto.password, this.SALT_ROUNDS);

    // 3. Transação Atômica
    return this.prisma.$transaction(async (tx) => {
      const organization = await this.organizationsRepository.create(
        {
          name: dto.companyName,
          slug: slug,
        },
        tx,
      );

      const user = await this.organizationsRepository.createOwner(
        {
          email: dto.email,
          fullName: dto.ownerName,
          password_hash: hashedPassword, // Senha criptografada
          role: 'OWNER',
          organization: { connect: { id: organization.id } },
        },
        tx,
      );

      const { password_hash, ...userWithoutPassword } = user;

      return { organization, user: userWithoutPassword };
    });
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
