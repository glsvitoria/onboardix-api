import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { compare } from 'bcryptjs';
import { UsersRepository } from '@/users/repositories/users.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(dto: LoginDto) {
    // 1. Busca o usuário (garanta que o repositório retorne a senha)
    const user = await this.usersRepository.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // 2. Compara a senha digitada com o hash do banco
    const isPasswordValid = await compare(dto.password, user.password_hash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // 3. Retorna os dados para gerar o token (sem a senha!)
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
    };
  }

  async login(user: any) {
    const payload = {
      sub: user.id, // O ID do usuário vira o 'sub' (subject)
      email: user.email,
      role: user.role,
      orgId: user.organizationId, // Essencial para o multi-tenancy
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }
}
