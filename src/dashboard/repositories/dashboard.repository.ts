import { EmployeesResumePaginationDto } from '../dto/employees-resume-pagination.dto';
import { UserWithTaskCompletedCountEntity } from '@/users/entity/user-with-task-completed-count';

export abstract class DashboardRepository {
  abstract findOrganizationMembersWithTasks(
    employeesResumePaginationDto: EmployeesResumePaginationDto,
  ): Promise<{
    employees: UserWithTaskCompletedCountEntity[];
    total: number;
  }>;
  abstract getOrgStats(orgId: string): Promise<{
    totalEmployees: number;
    completedTasks: number;
    pendingTasks: number;
  }>;
  abstract getAverageProgress(orgId: string): Promise<number>;
  abstract getCompletionHistory(
    orgId: string,
  ): Promise<{ date: Date; count: number }[]>;
}
