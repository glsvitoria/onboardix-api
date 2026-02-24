import { Controller, Post, Get, Body } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UserRole } from '@/generated/prisma/enums';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '@/common/types/authenticated-user';
import { Roles } from '@/common/decorators/roles.decorator';
import { AccessTokenAuth } from '@/common/decorators/access-token.decorator';

@Controller('templates')
@AccessTokenAuth()
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Post()
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  async create(
    @Body() dto: CreateTemplateDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.templatesService.create(dto, user.orgId);
  }

  @Get()
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  async findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.templatesService.findAll(user.orgId);
  }
}
