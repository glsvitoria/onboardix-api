import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Resend } from 'resend';
import { onboardingAssignmentTemplate } from './templates/onboarding-assignment.template';
import { ErrorMessagesHelper } from '@/common/helpers/error-messages.helper';
import { leadConfirmationTemplate } from './templates/lead-confirmation.template';
import { welcomeOrganizationTemplate } from './templates/welcome-org.template';
import { invitationTemplate } from './templates/invitation.template';
import { env } from '@/config/env-validation';
import { passwordRecoveryTemplate } from './templates/password-recovery.template';

@Injectable()
export class MailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(env.RESEND_API_KEY);
  }

  async sendInvitationEmployee(
    email: string,
    organizationName: string,
    token: string,
  ) {
    const invitationUrl = `${env.SITE_URL}/auth/aceitar-convite?token=${token}`;

    const { data, error } = await this.resend.emails.send({
      from: env.EMAIL_FROM,
      to: [email],
      subject: `Você foi convidado para a organização ${organizationName} no Onboardix!`,
      html: invitationTemplate({
        organizationName,
        url: invitationUrl,
      }),
    });

    if (error) {
      console.error('[MailService Invitation Error]', error);
      throw new Error('Falha ao enviar e-mail de convite');
    }

    return data;
  }

  async sendLeadConfirmation(email: string) {
    const { data, error } = await this.resend.emails.send({
      from: env.EMAIL_FROM,
      to: [email],
      subject: '🚀 Recebemos seu pedido de acesso Beta!',
      html: leadConfirmationTemplate(),
    });

    if (error) {
      console.error('[MailService Beta Error]', error);
      return null;
    }

    return data;
  }

  async sendOnboardingAssignment(
    email: string,
    name: string,
    templateName: string,
  ) {
    const dashboardUrl = `${env.SITE_URL}/dashboard`;

    const { data, error } = await this.resend.emails.send({
      from: env.EMAIL_FROM,
      to: [email],
      subject: '🚀 Seu onboarding começou!',
      html: onboardingAssignmentTemplate({
        name,
        templateName,
        url: dashboardUrl,
      }),
    });

    if (error) {
      console.error('[MailService]', error);
      throw new InternalServerErrorException(
        ErrorMessagesHelper.FAILED_TO_SEND_EMAIL,
      );
    }

    return data;
  }

  async sendPasswordRecovery(email: string, code: string, userName?: string) {
    const { data, error } = await this.resend.emails.send({
      from: env.EMAIL_FROM,
      to: [email],
      subject: 'Recuperação de Senha - Onboardix',
      html: passwordRecoveryTemplate({
        code,
        userName,
        expiresInMinutes: 15,
      }),
    });

    if (error) {
      console.error('[MailService Password Recovery Error]', error);
      throw new InternalServerErrorException(
        ErrorMessagesHelper.FAILED_TO_SEND_EMAIL,
      );
    }

    return data;
  }

  async sendWelcomeOrganization(
    email: string,
    ownerName: string,
    companyName: string,
  ) {
    const dashboardUrl =
      process.env.FRONTEND_URL || 'https://onboardix.com/dashboard';

    const { data, error } = await this.resend.emails.send({
      from: process.env.EMAIL_FROM || 'Onboardix <onboarding@resend.dev>',
      to: [email],
      subject: `Bem-vindo ao Onboardix, ${ownerName}! 🚀`,
      html: welcomeOrganizationTemplate({
        ownerName,
        companyName,
        url: dashboardUrl,
      }),
    });

    if (error) {
      // No caso de boas-vindas, apenas logamos o erro para não dar
      // InternalServerError se a conta já foi criada no banco.
      console.error('[MailService Welcome Error]', error);
      return null;
    }

    return data;
  }
}
