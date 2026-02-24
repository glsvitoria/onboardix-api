import { Module } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { TemplatesController } from './templates.controller';
import { PrismaTemplatesRepository } from './repositories/prisma-templates.repository';
import { TemplatesRepository } from './repositories/template.repository';

@Module({
  providers: [
    TemplatesService,
    {
      provide: TemplatesRepository,
      useClass: PrismaTemplatesRepository,
    },
  ],
  controllers: [TemplatesController],
})
export class TemplatesModule {}
