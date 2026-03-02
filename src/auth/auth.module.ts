import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '@/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { StrategiesHelper } from '@/common/helpers/strategies.helper';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { env } from '@/config/env-validation';
import { UsersRepository } from '@/users/repositories/users.repository';
import { PrismaUsersRepository } from '@/users/repositories/prisma-users.repository';
import { OrganizationsRepository } from '@/organizations/repositories/organizations.repository';
import { PrismaOrganizationsRepository } from '@/organizations/repositories/prisma-organizations.repository';

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
  providers: [
    AuthService,
    AccessTokenStrategy,
    {
      provide: OrganizationsRepository,
      useClass: PrismaOrganizationsRepository,
    },
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
