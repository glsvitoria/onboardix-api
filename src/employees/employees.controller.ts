import { AccessTokenAuth } from '@/common/decorators/access-token.decorator';
import { Roles } from '@/common/decorators/roles.decorator';
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '@/common/types/authenticated-user';

@Controller('employees')
@AccessTokenAuth()
export class EmployeesController {
  constructor(private employeesService: EmployeesService) {}

  @Post(':id/assign/:templateId')
  @Roles('ADMIN', 'OWNER') // Apenas gestores podem atribuir
  async assign(
    @Param('id') userId: string,
    @Param('templateId') templateId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.employeesService.assignTemplate(userId, templateId, user.orgId);
  }

  @Get('my-progress')
  @Roles('MEMBER', 'ADMIN', 'OWNER') // Qualquer um vê o próprio progresso
  async getMyProgress(@CurrentUser() user: AuthenticatedUser) {
    return this.employeesService.getEmployeeProgress(user.sub);
  }

  @Get()
  @Roles('ADMIN', 'OWNER') // Apenas gestores listam todos
  async list(@CurrentUser() user: AuthenticatedUser) {
    return this.employeesService.listEmployees(user.orgId);
  }

  @Patch('tasks/:taskId/toggle')
  async toggleTask(
    @CurrentUser() user: AuthenticatedUser, // Ajustado para o objeto
    @Param('taskId') taskId: string,
    @Body('completed') completed: boolean,
  ) {
    return this.employeesService.toggleTaskStatus(user.sub, taskId, completed);
  }

  @Get(':id/detail')
  @Roles('ADMIN', 'OWNER')
  async getDetail(
    @Param('id') employeeId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.employeesService.getEmployeeDetail(employeeId, user.orgId);
  }
}
