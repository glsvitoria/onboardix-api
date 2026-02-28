import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '@/common/types/authenticated-user';
import { UserRole } from '@/generated/prisma/enums';
import { EmployeesResumePaginationDto } from './dto/employees-resume-pagination.dto';
import { ProtectedRoles } from '@/common/decorators/protected-routes';

@Controller('dashboard')
@ProtectedRoles(UserRole.ADMIN, UserRole.OWNER)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('employees-resume')
  async employeesResume(
    @CurrentUser() user: AuthenticatedUser,
    @Query() employeesResumePaginationDto: EmployeesResumePaginationDto,
  ) {
    employeesResumePaginationDto.organizationId = user.orgId;

    return this.dashboardService.employeesResume(employeesResumePaginationDto);
  }

  @Get('general-stats')
  async general(@CurrentUser() user: AuthenticatedUser) {
    return this.dashboardService.getGeneralStats(user.orgId);
  }

  @Get('search')
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
