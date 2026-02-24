import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AccessTokenAuth } from '@/common/decorators/access-token.decorator';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '@/common/types/authenticated-user';

@Controller('dashboard')
@AccessTokenAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @Roles('ADMIN', 'OWNER') // Colaboradores comuns (MEMBER) não podem ver o progresso dos outros
  async getStats(@CurrentUser() user: AuthenticatedUser) {
    return this.dashboardService.getOrganizationStats(user.orgId);
  }
}
