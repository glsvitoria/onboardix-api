import { Injectable } from '@nestjs/common';
import { LeadsRepository } from './repositories/leads.repository';
import { CreateLeadDto } from './dto/create-lead.dto';
import { MailService } from '@/mail/mail.service';
import { SuccessMessagesHelper } from '@/common/helpers/success-messages.helper';

@Injectable()
export class LeadsService {
  constructor(
    private readonly leadsRepository: LeadsRepository,
    private readonly mailService: MailService,
  ) {}

  async register(createLeadDto: CreateLeadDto) {
    const lead = await this.leadsRepository.create(createLeadDto.email);

    this.mailService
      .sendLeadConfirmation(lead.email)
      .catch((err) =>
        console.error('Erro silencioso no envio de email beta:', err),
      );

    return {
      message: SuccessMessagesHelper.LEAD_CONFIRMATION,
    };
  }
}
