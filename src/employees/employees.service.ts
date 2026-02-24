import { Injectable, NotFoundException } from '@nestjs/common';
import { EmployeesRepository } from './repositories/employees.repository';
import { MailService } from '@/mail/mail.service';

@Injectable()
export class EmployeesService {
  constructor(
    private readonly employeesRepository: EmployeesRepository,
    private readonly mailService: MailService, // Injetando o serviço de e-mail
  ) {}

  async assignTemplate(userId: string, templateId: string, orgId: string) {
    // 1. Busca o template e as tarefas vinculadas
    const template = await this.employeesRepository.findTemplateWithTasks(
      templateId,
      orgId,
    );
    if (!template) throw new NotFoundException('Template não encontrado');

    // 2. Busca os dados do usuário para o envio do e-mail
    const user = await this.employeesRepository.findUserById(userId);
    if (!user) throw new NotFoundException('Usuário não encontrado');

    // 3. Prepara as tarefas para inserção em massa (Batch)
    const userTasks = template.tasks.map((task) => ({
      userId,
      taskId: task.id,
    }));

    // 4. Salva no banco de dados
    const result = await this.employeesRepository.assignTasks(userTasks);

    // 5. Dispara o e-mail via Resend (sem travar a resposta da API)
    this.mailService
      .sendOnboardingAssignment(user.email, user.fullName, template.title)
      .catch((err) => {
        // Logamos o erro mas não quebramos a requisição, pois o dado já foi salvo
        console.error(
          `[MailError] Falha ao enviar e-mail para ${user.email}:`,
          err,
        );
      });

    return result;
  }

  async getEmployeeProgress(userId: string) {
    const tasks = await this.employeesRepository.findUserTasks(userId);

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

  async toggleTaskStatus(userId: string, taskId: string, completed: boolean) {
    // 1. Validar se o vínculo existe
    const userTask = await this.employeesRepository.findUserTask(
      userId,
      taskId,
    );

    if (!userTask) {
      throw new NotFoundException('Tarefa não atribuída a este usuário');
    }

    // 2. Atualizar status
    return this.employeesRepository.updateTaskStatus(userId, taskId, completed);
  }

  async listEmployees(orgId: string) {
    const users = await this.employeesRepository.findAllByOrg(orgId);

    return users.map((user) => {
      const totalTasks = user.assignedTasks.length;
      const completedTasks = user.assignedTasks.filter(
        (t) => t.completedAt,
      ).length;
      const progress =
        totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      return {
        id: user.id,
        name: user.fullName,
        email: user.email,
        role: user.role,
        joinedAt: user.createdAt,
        onboarding: {
          status:
            totalTasks === 0
              ? 'NOT_STARTED'
              : progress === 100
                ? 'COMPLETED'
                : 'IN_PROGRESS',
          progress: `${progress}%`,
          taskCount: totalTasks,
        },
      };
    });
  }

  async getEmployeeDetail(userId: string, orgId: string) {
    const employee = await this.employeesRepository.findEmployeeDetail(
      userId,
      orgId,
    );

    if (!employee) {
      throw new NotFoundException('Colaborador não encontrado');
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
      tasks, // Lista completa para o RH auditar
    };
  }
}
