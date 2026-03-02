import { Injectable, NotFoundException } from '@nestjs/common';
import { EmployeesRepository } from './repositories/employees.repository';
import { MailService } from '@/mail/mail.service';
import { UsersRepository } from '@/users/repositories/users.repository';
import { UserTasksRepository } from '@/user-task/repositories/user-tasks.repositories';
import { FindAllPaginationDto } from './dto/find-all-pagination.dto';
import { ErrorMessagesHelper } from '@/common/helpers/error-messages.helper';
import { SuccessMessagesHelper } from '@/common/helpers/success-messages.helper';
import { TemplatesRepository } from '@/templates/repositories/template.repository';
import { UserWithProgressEntity } from '@/users/entity/user-with-progress';
import { UserOnboardingStatus } from '@/users/entity/user-progress';

@Injectable()
export class EmployeesService {
  constructor(
    private readonly employeesRepository: EmployeesRepository,
    private readonly templatesRepository: TemplatesRepository,
    private readonly usersRepository: UsersRepository,
    private readonly userTasksRepository: UserTasksRepository,
    private readonly mailService: MailService,
  ) {}

  async assignTemplate(userId: string, templateId: string, orgId: string) {
    const template = await this.templatesRepository.findById(templateId, orgId);

    if (!template)
      throw new NotFoundException(ErrorMessagesHelper.TEMPLATE_NOT_FOUND);

    const user = await this.usersRepository.findById(userId, orgId);

    if (!user) throw new NotFoundException(ErrorMessagesHelper.USER_NOT_FOUND);

    const userTasks = template.tasks.map((task) => ({
      userId,
      taskId: task.id,
    }));

    await this.employeesRepository.assignTasks(userTasks);

    this.mailService
      .sendOnboardingAssignment(user.email, user.fullName, template.title)
      .catch((err) => {
        console.error(
          `[MailError] Falha ao enviar e-mail para ${user.email}:`,
          err,
        );
      });

    return {
      message: SuccessMessagesHelper.TEMPLATE_ASSIGNED,
    };
  }

  async getEmployeeDetail(orgId: string, userId: string) {
    const employee = await this.employeesRepository.findEmployeeDetail(
      userId,
      orgId,
    );

    if (!employee) {
      throw new NotFoundException(ErrorMessagesHelper.USER_NOT_FOUND);
    }

    const tasks = employee.assignedTasks.map((ut) => ({
      id: ut.taskId,
      title: ut.task.title,
      content: ut.task.content,
      completed: !!ut.completedAt,
      completedAt: ut.completedAt,
      order: ut.task.order,
    }));

    const completedCount = tasks.filter((t) => t.completed).length;
    const totalCount = tasks.length;

    return {
      id: employee.id,
      fullName: employee.fullName,
      email: employee.email,
      progress:
        totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0,
      stats: {
        total: totalCount,
        completed: completedCount,
        pending: totalCount - completedCount,
      },
      tasks,
    };
  }

  async getEmployeeProgress(userId: string, orgId: string) {
    const tasks = await this.userTasksRepository.findByUserId(userId, orgId);

    const total = tasks.length;
    const completed = tasks.filter((t) => t.completedAt !== null).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      percentage,
      total,
      completed,
      tasks,
    };
  }

  async listEmployees(
    orgId: string,
    findAllPaginationDto: FindAllPaginationDto,
  ) {
    findAllPaginationDto.organizationId = orgId;

    const { users, total } =
      await this.employeesRepository.findAllWithUserTasks(findAllPaginationDto);

    const usersFormatted = users.map((user) => {
      const totalTasks = user.assignedTasks.length;
      const completedTasks = user.assignedTasks.filter(
        (t) => t.completedAt,
      ).length;
      const progress =
        totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      return {
        ...user,
        onboarding: {
          status:
            progress === 0
              ? UserOnboardingStatus.NOT_STARTED
              : progress === 100
                ? UserOnboardingStatus.COMPLETED
                : UserOnboardingStatus.IN_PROGRESS,
          progress: `${progress}%`,
          taskCount: totalTasks,
        },
      };
    });

    return {
      users: usersFormatted.map(user => new UserWithProgressEntity(user)),
      total,
    };
  }

  async toggleTaskStatus(
    userId: string,
    orgId: string,
    taskId: string,
    completed: boolean,
  ) {
    const userTask = await this.userTasksRepository.findByTaskId(
      taskId,
      userId,
      orgId,
    );

    if (!userTask) {
      throw new NotFoundException(
        ErrorMessagesHelper.TASK_NOT_ASSIGNED_TO_USER,
      );
    }

    await this.employeesRepository.updateTaskStatus(userId, taskId, completed);

    return {
      message: SuccessMessagesHelper.TASK_STATUS_UPDATED,
    };
  }
}
