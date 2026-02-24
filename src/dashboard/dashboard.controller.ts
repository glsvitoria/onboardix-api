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

  @Get('organization-report')
  @Roles('ADMIN', 'OWNER')
  async getReport(@CurrentUser() user: AuthenticatedUser) {
    return this.dashboardService.getOrganizationStats(user.orgId);
  }

  @Get('general-stats')
  @Roles('ADMIN', 'OWNER')
  async getGeneral(@CurrentUser() user: AuthenticatedUser) {
    return this.dashboardService.getGeneralStats(user.orgId);
  }
}
