import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Resend } from 'resend';
import { onboardingAssignmentTemplate } from './templates/onboarding-assignment.template';
import { ErrorMessagesHelper } from '@/common/helpers/error-messages.helper';

@Injectable()
export class MailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendOnboardingAssignment(
    email: string,
    name: string,
    templateName: string,
  ) {
    const dashboardUrl =
      process.env.FRONTEND_URL || 'https://onboardix.com/dashboard';

    const { data, error } = await this.resend.emails.send({
      from: process.env.EMAIL_FROM || 'Onboardix <onboarding@resend.dev>',
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
}
