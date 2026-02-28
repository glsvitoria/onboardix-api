import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '@/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { StrategiesHelper } from '@/common/helpers/strategies.helper';
import { AccessTokenStrategy } from './strategies/access-token.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({
      defaultStrategy: StrategiesHelper.ACCESS_TOKEN_STRATEGY,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'secret-key',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, AccessTokenStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
