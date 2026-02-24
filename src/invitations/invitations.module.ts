import { Module } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { InvitationsController } from './invitations.controller';
import { InvitationsRepository } from './repositories/invitations.repository';
import { PrismaInvitationsRepository } from './repositories/prisma-invitations.repository';

@Module({
  providers: [
    InvitationsService,
    {
      provide: InvitationsRepository,
      useClass: PrismaInvitationsRepository,
    },
  ],
  controllers: [InvitationsController],
})
export class InvitationsModule {}
