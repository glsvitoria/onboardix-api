import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsRepository } from './repositories/organizations.repository';
import { PrismaOrganizationsRepository } from './repositories/prisma-organizations.repository';

@Module({
  providers: [
    OrganizationsService,
    {
      provide: OrganizationsRepository,
      useClass: PrismaOrganizationsRepository,
    },
  ],
  controllers: [OrganizationsController],
})
export class OrganizationsModule {}
