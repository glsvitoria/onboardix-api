import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { OrganizationsRepository } from '@/organizations/repositories/organizations.repository';
import { PrismaOrganizationsRepository } from '@/organizations/repositories/prisma-organizations.repository';
import { RefreshTokensRepository } from '@/refresh-token/repositories/refresh-token';
import { PrismaRefreshTokensRepository } from '@/refresh-token/repositories/prisma-refresh-tokens';
import { UsersRepository } from '@/users/repositories/users.repository';
import { PrismaUsersRepository } from '@/users/repositories/prisma-users.repository';
import { InvitationsRepository } from '@/invitations/repositories/invitations.repository';
import { PrismaInvitationsRepository } from '@/invitations/repositories/prisma-invitations.repository';
import { LeadsRepository } from '@/leads/repositories/leads.repository';
import { PrismaLeadsRepository } from '@/leads/repositories/prisma-leads.repository';
import { UserTasksRepository } from '@/user-task/repositories/user-tasks.repositories';
import { PrismaUserTasksRepository } from '@/user-task/repositories/prisma-user-tasks.repository';
import { DashboardRepository } from '@/dashboard/repositories/dashboard.repository';
import { PrismaDashboardRepository } from '@/dashboard/repositories/prisma-dashboard.repository';
import { TemplatesRepository } from '@/templates/repositories/template.repository';
import { PrismaTemplatesRepository } from '@/templates/repositories/prisma-templates.repository';
import { EmployeesRepository } from '@/employees/repositories/employees.repository';
import { PrismaEmployeesRepository } from '@/employees/repositories/prisma-employees.repository';

@Global()
@Module({
  providers: [
    PrismaService,
    {
      provide: DashboardRepository,
      useClass: PrismaDashboardRepository,
    },
    {
      provide: EmployeesRepository,
      useClass: PrismaEmployeesRepository,
    },
    {
      provide: InvitationsRepository,
      useClass: PrismaInvitationsRepository,
    },
    {
      provide: LeadsRepository,
      useClass: PrismaLeadsRepository,
    },
    {
      provide: OrganizationsRepository,
      useClass: PrismaOrganizationsRepository,
    },
    {
      provide: RefreshTokensRepository,
      useClass: PrismaRefreshTokensRepository,
    },
    {
      provide: TemplatesRepository,
      useClass: PrismaTemplatesRepository,
    },
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: UserTasksRepository,
      useClass: PrismaUserTasksRepository,
    },
  ],
  exports: [
    DashboardRepository,
    EmployeesRepository,
    InvitationsRepository,
    LeadsRepository,
    OrganizationsRepository,
    PrismaService,
    RefreshTokensRepository,
    TemplatesRepository,
    UsersRepository,
    UserTasksRepository,
  ],
})
export class DatabaseModule {}
