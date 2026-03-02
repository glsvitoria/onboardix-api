import { Module } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { TemplatesController } from './templates.controller';
import { PrismaTemplatesRepository } from './repositories/prisma-templates.repository';
import { TemplatesRepository } from './repositories/template.repository';
import { OrganizationsRepository } from '@/organizations/repositories/organizations.repository';
import { PrismaOrganizationsRepository } from '@/organizations/repositories/prisma-organizations.repository';

@Module({
  providers: [
    TemplatesService,
    {
      provide: OrganizationsRepository,
      useClass: PrismaOrganizationsRepository,
    },
    {
      provide: TemplatesRepository,
      useClass: PrismaTemplatesRepository,
    },
  ],
  controllers: [TemplatesController],
})
export class TemplatesModule {}
