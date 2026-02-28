
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { UserTasksService } from './user-tasks.service';
import type { AuthenticatedUser } from '@/common/types/authenticated-user';
import { ValidationUUID } from '@/common/pipes/validation-uuid.pipe';
import { UserRole } from '@/generated/prisma/enums';
import { ProtectedRoles } from '@/common/decorators/protected-routes';

@Controller('my-tasks')
@ProtectedRoles(UserRole.MEMBER)
export class UserTasksController {
  constructor(private readonly userTasksService: UserTasksService) {}

  @Get()
  async getMyTasks(@CurrentUser() user: AuthenticatedUser) {
    return this.userTasksService.getMyTasks(user.sub);
  }

  @Patch(':userTaskId/toggle')
  async toggle(
    @Body('completed') completed: boolean,
    @CurrentUser() user: AuthenticatedUser,
    @Param('userTaskId', new ValidationUUID()) userTaskId: string,
  ) {
    return this.userTasksService.toggleTask(user.sub, userTaskId, completed);
  }
}
