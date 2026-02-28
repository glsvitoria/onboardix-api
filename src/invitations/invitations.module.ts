import { Module } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { InvitationsController } from './invitations.controller';
import { InvitationsRepository } from './repositories/invitations.repository';
import { PrismaInvitationsRepository } from './repositories/prisma-invitations.repository';
import { UsersRepository } from '@/users/repositories/users.repository';
import { PrismaUsersRepository } from '@/users/repositories/prisma-users.repository';
import { OrganizationsRepository } from '@/organizations/repositories/organizations.repository';
import { PrismaOrganizationsRepository } from '@/organizations/repositories/prisma-organizations.repository';

@Module({
  providers: [
    InvitationsService,
    {
      provide: OrganizationsRepository,
      useClass: PrismaOrganizationsRepository,
    },
    {
      provide: InvitationsRepository,
      useClass: PrismaInvitationsRepository,
    },
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
  ],
  controllers: [InvitationsController],
})
export class InvitationsModule {}
