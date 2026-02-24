import { Module } from '@nestjs/common';
import { UserTasksService } from './user-tasks.service';
import { UserTasksController } from './user-tasks.controller';
import { UserTasksRepository } from './repositories/user-tasks.repositories';
import { PrismaUserTasksRepository } from './repositories/prisma-user-tasks.repository';

@Module({
  controllers: [UserTasksController],
  providers: [
    UserTasksService,
    {
      provide: UserTasksRepository,
      useClass: PrismaUserTasksRepository,
    },
  ],
  exports: [UserTasksRepository],
})
export class UserTasksModule {}
