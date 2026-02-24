import { AccessTokenAuth } from '@/common/decorators/access-token.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { UserTasksService } from './user-tasks.service';
import type { AuthenticatedUser } from '@/common/types/authenticated-user';
import { ValidationUUID } from '@/common/pipes/validation-uuid.pipe';
import { Roles } from '@/common/decorators/roles.decorator';
import { UserRole } from '@/generated/prisma/enums';

@Controller('my-tasks')
@AccessTokenAuth()
export class UserTasksController {
  constructor(private readonly userTasksService: UserTasksService) {}

  @Get()
  @Roles(UserRole.MEMBER)
  async getMyTasks(@CurrentUser() user: AuthenticatedUser) {
    return this.userTasksService.getMyTasks(user.sub);
  }

  @Patch(':taskId/toggle')
  @Roles(UserRole.MEMBER)
  async toggle(
    @Body('completed') completed: boolean,
    @CurrentUser() user: AuthenticatedUser,
    @Param('taskId', new ValidationUUID()) taskId: string,
  ) {
    return this.userTasksService.toggleTask(user.sub, taskId, completed);
  }
}
