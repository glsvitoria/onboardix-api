import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { DashboardRepository } from './repositories/dashboard.repository';
import { PrismaDashboardRepository } from './repositories/prisma-dashboard.repository';
import { UsersRepository } from '@/users/repositories/users.repository';
import { PrismaUsersRepository } from '@/users/repositories/prisma-users.repository';
import { TemplatesRepository } from '@/templates/repositories/template.repository';
import { PrismaTemplatesRepository } from '@/templates/repositories/prisma-templates.repository';

@Module({
  providers: [
    DashboardService,
    {
      provide: DashboardRepository,
      useClass: PrismaDashboardRepository,
    },
    {
      provide: TemplatesRepository,
      useClass: PrismaTemplatesRepository,
    },
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
  ],
  controllers: [DashboardController],
})
export class DashboardModule {}
