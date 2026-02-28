import { Module } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { LeadsRepository } from './repositories/leads.repository';
import { PrismaLeadsRepository } from './repositories/prisma-leads.repository';
import { LeadsController } from './leads.controller';

@Module({
  providers: [
    LeadsService,
    {
      provide: LeadsRepository,
      useClass: PrismaLeadsRepository,
    },
  ],
  controllers: [LeadsController],
})
export class LeadsModule {}
