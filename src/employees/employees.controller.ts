import { AccessTokenAuth } from '@/common/decorators/access-token.decorator';
import { Roles } from '@/common/decorators/roles.decorator';
import { Controller, Get, Param, Post } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '@/common/types/authenticated-user';

@Controller('employees')
@AccessTokenAuth()
export class EmployeesController {
  constructor(private service: EmployeesService) {}

  @Post(':id/assign/:templateId')
  @Roles('ADMIN', 'OWNER') // Apenas gestores podem atribuir
  async assign(
    @Param('id') userId: string,
    @Param('templateId') templateId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.assignTemplate(userId, templateId, user.orgId);
  }

  @Get('my-progress')
  @Roles('MEMBER', 'ADMIN', 'OWNER') // Qualquer um vê o próprio progresso
  async getMyProgress(@CurrentUser() user: AuthenticatedUser) {
    return this.service.getEmployeeProgress(user.sub);
  }
}
