import { Module } from '@nestjs/common';
import { OrganizationsModule } from './organizations/organizations.module';
import { AuthModule } from './auth/auth.module';
import { TemplatesModule } from './templates/templates.module';
import { EmployeesModule } from './employees/employees.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { InvitationsModule } from './invitations/invitations.module';
import { UserTasksModule } from './user-task/users-tasks.module';
import { DatabaseModule } from './database/database.module';
import { MailModule } from './mail/mail.module';
import { LeadsModule } from './leads/leads.module';

@Module({
  imports: [
    OrganizationsModule,
    AuthModule,
    TemplatesModule,
    DatabaseModule,
    EmployeesModule,
    DashboardModule,
    InvitationsModule,
    UserTasksModule,
    MailModule,
    LeadsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
