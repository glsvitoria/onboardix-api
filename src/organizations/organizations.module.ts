import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsRepository } from './repositories/organizations.repository';
import { PrismaOrganizationsRepository } from './repositories/prisma-organizations.repository';
import { PrismaUsersRepository } from '@/users/repositories/prisma-users.repository';
import { UsersRepository } from '@/users/repositories/users.repository';

@Module({
  providers: [
    OrganizationsService,
    {
      provide: OrganizationsRepository,
      useClass: PrismaOrganizationsRepository,
    },
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
  ],
  controllers: [OrganizationsController],
})
export class OrganizationsModule {}
