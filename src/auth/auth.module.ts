import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { env } from '@/config/env-validation';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: env.ACCESS_TOKEN_SECRET, // Use process.env.JWT_SECRET
      signOptions: { expiresIn: '1d' }, // Token vale por 1 dia
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
