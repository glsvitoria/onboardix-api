import { Module } from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';
import { PrismaUsersRepository } from './repositories/prisma-users.repository';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';

@Module({
  providers: [
    UsersService,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
  ],
  controllers: [UsersController],
  exports: [UsersRepository]
})
export class UsersModule {}
