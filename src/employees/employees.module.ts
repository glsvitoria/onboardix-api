import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { EmployeesRepository } from './repositories/employees.repository';
import { PrismaEmployeesRepository } from './repositories/prisma-employees.repository';
import { UsersRepository } from '@/users/repositories/users.repository';
import { PrismaUsersRepository } from '@/users/repositories/prisma-users.repository';
import { UserTasksRepository } from '@/user-task/repositories/user-tasks.repositories';
import { PrismaUserTasksRepository } from '@/user-task/repositories/prisma-user-tasks.repository';

@Module({
  providers: [
    EmployeesService,
    {
      provide: EmployeesRepository,
      useClass: PrismaEmployeesRepository,
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
  controllers: [EmployeesController],
})
export class EmployeesModule {}
