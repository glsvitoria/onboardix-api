import { AccessTokenAuth } from '@/common/decorators/access-token.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { UserTasksService } from './user-tasks.service';
import type { AuthenticatedUser } from '@/common/types/authenticated-user';

@Controller('my-tasks')
@AccessTokenAuth()
export class UserTasksController {
  constructor(private readonly userTasksService: UserTasksService) {}

  @Get()
  async list(@CurrentUser() user: AuthenticatedUser) {
    return this.userTasksService.getMyTasks(user.sub);
  }

  @Patch(':taskId/toggle')
  async toggle(
    @CurrentUser() user: AuthenticatedUser,
    @Param('taskId') taskId: string,
    @Body('completed') completed: boolean,
  ) {
    return this.userTasksService.toggleTask(user.sub, taskId, completed);
  }
}
