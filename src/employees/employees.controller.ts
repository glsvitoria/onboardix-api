import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '@/common/types/authenticated-user';
import { UserRole } from '@/generated/prisma/enums';
import { ValidationUUID } from '@/common/pipes/validation-uuid.pipe';
import { FindAllPaginationDto } from './dto/find-all-pagination.dto';
import { ProtectedRoles } from '@/common/decorators/protected-routes';

@Controller('employees')
export class EmployeesController {
  constructor(private employeesService: EmployeesService) {}

  @Post(':userId/assign/:templateId')
  @ProtectedRoles(UserRole.ADMIN, UserRole.OWNER)
  async assign(
    @Param('userId', new ValidationUUID()) userId: string,
    @Param('templateId', new ValidationUUID()) templateId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.employeesService.assignTemplate(
      userId,
      templateId,
      user.orgId,
    );
  }

  @Get('my-progress')
  @ProtectedRoles(UserRole.MEMBER)
  async getMyProgress(@CurrentUser() user: AuthenticatedUser) {
    return this.employeesService.getEmployeeProgress(user.sub, user.orgId);
  }

  @Get()
  @ProtectedRoles(UserRole.ADMIN, UserRole.OWNER)
  async list(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: FindAllPaginationDto,
  ) {
    return this.employeesService.listEmployees(user.orgId, query);
  }

  @Patch('tasks/:taskId/toggle')
  @ProtectedRoles(UserRole.MEMBER)
  async toggleTask(
    @CurrentUser() user: AuthenticatedUser,
    @Param('taskId', new ValidationUUID()) taskId: string,
    @Body('completed') completed: boolean,
  ) {
    return this.employeesService.toggleTaskStatus(
      user.sub,
      user.orgId,
      taskId,
      completed,
    );
  }

  @Get(':userId/detail')
  @ProtectedRoles(UserRole.ADMIN, UserRole.OWNER)
  async getDetail(
    @Param('userId', new ValidationUUID()) userId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.employeesService.getEmployeeDetail(user.orgId, userId);
  }
}
