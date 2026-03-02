import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { RefreshTokenUser } from '../types/refresh-token-user';

/**
 * Extrai os dados validados pela RefreshTokenStrategy.
 * Retorna o sub (ID do usuário) e o refreshToken (string bruta).
 */
export const CurrentRefreshToken = createParamDecorator(
  (_: never, context: ExecutionContext): RefreshTokenUser => {
    const request = context.switchToHttp().getRequest<Request>();

    return request.user as RefreshTokenUser;
  },
);
