import { RefreshTokenGuard } from '@/auth/guards/refresh-token.guard';
import { UseGuards } from '@nestjs/common';

/**
 * Decorator que aplica a proteção por Access Token (JWT Comum).
 * Deve ser usado em rotas que exigem apenas que o usuário esteja logado.
 */
export const RefreshTokenProtected = () => UseGuards(RefreshTokenGuard);
