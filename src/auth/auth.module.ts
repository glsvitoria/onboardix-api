import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '@/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { StrategiesHelper } from '@/common/helpers/strategies.helper';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { env } from '@/config/env-validation';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({
      defaultStrategy: StrategiesHelper.ACCESS_TOKEN_STRATEGY,
    }),
    JwtModule.register({
      global: true,
      secret: env.ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, AccessTokenStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
