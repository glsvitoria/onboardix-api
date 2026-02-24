import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendOnboardingAssignment(email: string, name: string, templateName: string) {
    const { data, error } = await this.resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: [email],
      subject: '🚀 Seu onboarding começou!',
      html: `
        <h1>Olá, ${name}!</h1>
        <p>Sua jornada na empresa acabou de ganhar um roteiro.</p>
        <p>O RH atribuiu o template <strong>${templateName}</strong> para você.</p>
        <p>Acesse a plataforma para conferir suas tarefas e começar agora mesmo.</p>
        <br />
        <a href="https://onboardix.com/dashboard" style="background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Ver minhas tarefas
        </a>
      `,
    });

    if (error) {
      throw new InternalServerErrorException('Falha ao enviar e-mail');
    }

    return data;
  }
}