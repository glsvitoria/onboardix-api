
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { UserTasksService } from './user-tasks.service';
import type { AuthenticatedUser } from '@/common/types/authenticated-user';
import { ValidationUUID } from '@/common/pipes/validation-uuid.pipe';
import { UserRole } from '@/generated/prisma/enums';
import { ProtectedRoles } from '@/common/decorators/protected-routes';
import { UserTaskEntity } from './entity/user-task';

@Controller('my-tasks')
@ProtectedRoles(UserRole.MEMBER)
export class UserTasksController {
  constructor(private readonly userTasksService: UserTasksService) {}

  @Get()
  async getMyTasks(@CurrentUser() user: AuthenticatedUser) {
    const userTasks = await this.userTasksService.getMyTasks(user.sub);

    return userTasks.map(userTask => new UserTaskEntity(userTask))
  }

  @Patch(':id/toggle')
  async toggle(
    @Body('completed') completed: boolean,
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', new ValidationUUID()) userTaskId: string,
  ) {
    return this.userTasksService.toggleTask(user.sub, user.orgId, userTaskId, completed);
  }
}
