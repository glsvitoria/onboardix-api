import { StrategiesHelper } from '@/common/helpers/strategies.helper';
import { RefreshTokenPayload } from '@/common/types/refresh-token-payload';
import { env } from '@/config/env-validation';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export const SALT_ROUNDS = 10;

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  StrategiesHelper.REFRESH_TOKEN_STRATEGY,
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: env.REFRESH_TOKEN_SECRET,
      algorithms: ['HS256'],
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: RefreshTokenPayload) {
    const refreshToken = req.headers['authorization']
      .replace('Bearer', '')
      .trim();

    return {
      sub: payload.sub,
      refreshToken,
    };
  }
}
