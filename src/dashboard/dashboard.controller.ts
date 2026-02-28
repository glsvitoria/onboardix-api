import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AccessTokenAuth } from '@/common/decorators/access-token.decorator';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '@/common/types/authenticated-user';
import { UserRole } from '@/generated/prisma/enums';

@Controller('dashboard')
@AccessTokenAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('organization-report')
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  async getReport(@CurrentUser() user: AuthenticatedUser) {
    return this.dashboardService.getOrganizationStats(user.orgId);
  }

  @Get('general-stats')
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  async getGeneral(@CurrentUser() user: AuthenticatedUser) {
    return this.dashboardService.getGeneralStats(user.orgId);
  }

  @Get('search')
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  async search(
    @CurrentUser() user: AuthenticatedUser,
    @Query('q') query: string,
  ) {
    if (!query || query.length < 2) {
      return { results: [] };
    }

    return this.dashboardService.globalSearch(user.orgId, query);
  }
}
