import { PrismaService } from '@/database/prisma/prisma.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { organization: true },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return {
      access_token: this.jwtService.sign({
        sub: user.id,
        email: user.email,
        orgId: user.organizationId,
        role: user.role,
      }),
      user: {
        id: user.id,
        fullName: user.fullName,
        role: user.role,
        organizationName: user.organization.name,
      },
    };
  }
}
